#!/usr/bin/env zx
import 'zx/globals';

import swagger from '@apidevtools/swagger-parser';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import axios, { AxiosRequestConfig } from 'axios';
import { expect } from 'chai';
import * as dotenv from 'dotenv';
import { Listr } from 'listr2';
import { OpenAPIV3 } from 'openapi-types';
import path from 'path';
import { setTimeout } from 'timers/promises';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const specFile = argv.spec || process.env.INPUT_SPEC || 'spec/openapi.json';
const serverUrl = argv.server || process.env.SERVER_URL;

if (argv.help) {
  console.log(
    `
    Usage: 
      tsx scripts/smoke-test.ts [--spec <path>] [--server <url>] [--op <operation>]'
    
    Options:
      --spec <path>     Path to OpenAPI spec file (default: 'spec/openapi.json')
      --server <url>    URL of server to test (default: process.env.SERVER_URL)
      --op <operation>  Test only the specified operation (default: test all operations)
    
    Examples:
      tsx scripts/smoke-test.ts --spec spec/openapi.json
      tsx scripts/smoke-test.ts --op users-list
      tsx scripts/smoke-test.ts --op users-list --server http://api-review-url.example.com
  `
      .replace(/^ {4}/gm, '')
      .trim() + '\n',
  );

  process.exit(0);
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const URL_PARAM_VALUES = {
  notification_id: [],
  broadcast_id: [],
  topic: Array.from({ length: 10 }).map(() => 'acme-inc.orders.1234'),
  device_token: ['x4doKe98yEZ21Kum2Qq39M3b8jkhonuIupobyFnL0wJMSWAZ8zoTp2dyHgV'],
  import_id: [],
};

type Operation = {
  path: string;
  method: string;
  data?: Record<string, unknown>;
} & OpenAPIV3.OperationObject;

function getOperations(document: OpenAPIV3.Document) {
  const methods: Array<Operation> = [];

  for (const path of Object.keys(document.paths)) {
    for (const method of Object.keys(document.paths[path])) {
      const operation = document.paths[path][method] as OpenAPIV3.OperationObject;
      if (!operation.operationId) continue;
      methods.push(Object.assign(operation, { path, method }));
    }
  }

  return methods;
}

const headerMaskMap = {
  'X-MAGICBELL-API-KEY': '$MAGICBELL_API_KEY',
  'X-MAGICBELL-API-SECRET': '$MAGICBELL_API_SECRET',
  'X-MAGICBELL-USER-EMAIL': '$MAGICBELL_USER_EMAIL',
  'X-MAGICBELL-USER-EXTERNAL-ID': '$MAGICBELL_USER_EXTERNAL_ID',
  'X-MAGICBELL-USER-HMAC': '$MAGICBELL_USER_HMAC',
};

function toCurl({ method, baseURL, url, data, headers }: AxiosRequestConfig) {
  return [
    `curl -X ${method.toUpperCase()}`,
    `${baseURL}/${url.replace(/^\//, '')}`,
    Object.entries(headers)
      .map(([key, value]) => {
        // only replace the value with an env key if the header has a value, otherwise we can't debug missing headers.
        value = value ? headerMaskMap[key.toUpperCase()] || value : value;
        return `-H "${key}: ${value}"`;
      })
      .join(' '),
    data && `-d '${JSON.stringify(data)}'`,
  ].join(' ');
}

async function request(
  operation: Operation,
  type: 'no-headers' | 'authenticated' | 'invalid-auth' | 'preflight',
  params = {},
) {
  const start = Date.now();

  const headers = type === 'no-headers' ? {} : getAuthHeaders(['authenticated', 'preflight'].includes(type), operation);
  const data = getBodyContent(operation.requestBody).example;
  const method = type === 'preflight' ? 'OPTIONS' : operation.method;

  // HACK: this ain't really nice, is it?
  if (operation.operationId.startsWith('notification-preferences')) {
    headers['accept-version'] = 'v2';
  }

  if (isPublicApi(operation)) {
    headers['origin'] = 'https://magicbell-smoke-test.example.com';
  }

  const config: AxiosRequestConfig = {
    baseURL: serverUrl,
    method,
    url: operation.path,
    validateStatus: () => true,
    data,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'user-agent': 'magicbell-openapi-smoke-test',
      ...headers,
    },
    params,
  };

  if (type === 'preflight') {
    config.headers['access-control-request-method'] = operation.method;
    config.headers['access-control-request-headers'] =
      'content-type, origin, x-magicbell-api-key, x-magicbell-user-email, x-magicbell-user-hmac';
    config.headers['origin'] = 'https://magicbell-smoke-test.example.com';
    delete config.data;
  }

  const response = await axios.request(config).catch((e) => {
    console.log(`ERROR: request ${config.method} ${config.url} resulted in a network error:`, {
      error: { type: e.constructor.name, name: e.name, message: e.message },
      req: { headers: config.headers, data: config.data, params: config.params },
    });
    console.log('CURL:', toCurl(config));
    return e.response || {};
  });

  const duration = Date.now() - start;
  const error = response.data?.errors?.[0]?.message;

  return Object.assign(response, { duration, config, error });
}

function getByJsonPointer(obj: Record<string, unknown>, path: string) {
  return path
    .split('/')
    .filter(Boolean)
    .reduce((acc, part) => acc[part], obj);
}

function getBodyContent(body): { example?: unknown; schema: OpenAPIV3.SchemaObject } {
  return body?.content?.['application/json'] || { schema: {} };
}

function getSuccessStatusCode(operation: OpenAPIV3.OperationObject) {
  return Object.keys(operation.responses)
    .map((x) => Number(x))
    .find((response) => response >= 200 && response <= 299);
}

function getAuthHeaders(valid: boolean, operation: OpenAPIV3.OperationObject) {
  const needsEmail = operation.parameters?.some((p) => 'name' in p && p.name === 'X-MAGICBELL-USER-EMAIL');

  return needsEmail
    ? {
        'X-MAGICBELL-API-KEY': valid ? process.env.API_KEY : 'undefined',
        'X-MAGICBELL-USER-EMAIL': valid ? process.env.USER_EMAIL : 'undefined',
      }
    : {
        'X-MAGICBELL-API-KEY': valid ? process.env.API_KEY : 'undefined',
        'X-MAGICBELL-API-SECRET': valid ? process.env.API_SECRET : 'undefined',
      };
}

function getUrl(path: string, shift = true) {
  const urlParams = (path.match(/{\w+}/g) || []).map((param) => param.replace(/[{}]/g, ''));

  // if a request depends on urlParams, we'll use earlier created resources
  const params = Object.fromEntries(
    urlParams.map((param) => {
      const source = URL_PARAM_VALUES[param];
      if (!source) throw new Error(`No reserved values for param ${param}`);
      const value = shift ? source.shift() : source[0];
      if (!value) throw new Error(`No more values for param ${param}`);
      return [param, value];
    }),
  );

  return path.replace(/{([\s\S]+?)}/g, ($0, $1) => encodeURIComponent(params[$1] || ''));
}

function isPublicApi(operation: Operation) {
  return !operation.parameters?.some((p) => 'name' in p && p.name === 'X-MAGICBELL-API-SECRET');
}

function expectPathToEqual(obj: Record<string, unknown>, path: string, expected: unknown) {
  const pointer = path.replaceAll(/[\[.]/g, '/').replace(/['"\]]/g, '');
  const actual = getByJsonPointer(obj, pointer);
  expect(actual, path).equal(expected);
}

function createTests(operations: Operation[]) {
  const suites = new Listr([], { exitOnError: false });

  for (const operation of operations) {
    const { method, path, operationId } = operation;
    if (argv.op && argv.op !== operationId) continue;

    const list = new Listr([], {
      exitOnError: false,
    });

    suites.add({
      title: `${method.toUpperCase()} ${path} ${chalk.gray(`(id: ${operationId})`)}`,
      task: () => list,
    });

    list.parentTask = suites.tasks[suites.tasks.length - 1];

    list.add({
      title: 'HTTP 401: request without authentication headers return 401 unauthorized',
      task: async function () {
        const res = await request(operation, 'no-headers');
        this.requestConfig = res.config;

        expect(res.status, res.error).equal(401);
        expect(res.duration).lessThan(5000);
      },
    });

    list.add({
      title: 'HTTP 401: request with invalid auth headers returns 401 unauthorized',
      task: async function () {
        const res = await request(operation, 'invalid-auth');
        this.requestConfig = res.config;

        expect(res.status, res.error).equal(401);
        expect(res.duration).lessThan(5000);
      },
    });

    // we can't smoke test endpoints depending on input data, as input is created async. Technically, we
    // should be able to deleteNotification({ id: createNotification().id }), but as the create action
    // is done through a job runner (sidekiq) the `delete` will be executed before the `create` is done.
    const shouldSkip =
      operation.path.includes(':{') ||
      operationId.startsWith('users-') ||
      operationId === 'subscriptions-delete' ||
      operationId === 'push-subscriptions-delete' ||
      operationId === 'imports-get';

    const code = getSuccessStatusCode(operation);
    list.add({
      title: `HTTP ${code}: request with valid api key and payload returns expected response`,
      skip: () => shouldSkip,
      task: async function () {
        operation.path = getUrl(path);

        const res = await request(operation, 'authenticated');
        this.requestConfig = res.config;

        expect(res.status, res.error).equal(code);
        expect(res.duration).lessThan(5000);

        if (isPublicApi(operation)) {
          expectPathToEqual(res, 'headers["access-control-allow-origin"]', '*');
        }

        // We're adjust the schema, as there's a difference between `input type` and `return type`, and
        // the `components.schemas` currently only hold input types.
        const schema = getBodyContent(operation.responses[res.status]).schema;
        ajv.validate({ ...schema, required: [] }, res.data);

        const errors = (ajv.errors || []).filter(
          (x) =>
            x.keyword !== 'required' && // ignore required fields, as api might return partial objects
            x.params?.format !== 'uri' && // ignore uri format, action_url might be an empty string, which is not a valid uri
            x.instancePath !== '/subscriptions/2/categories/0/reason' && // difference between input && output
            x.params?.additionalProperty !== 'meta_data' && // ignore deprecated fields
            !(x.params?.additionalProperty === 'user' && operationId === 'notifications-list'), // only op with additional fields next to the wrapper
        );

        if (errors.length === 0) return;

        const uniqueErrors = new Map();
        for (const error of errors) {
          uniqueErrors.set(`${error.keyword}:${error.schemaPath}`, {
            error,
            data: getByJsonPointer(res.data, error.instancePath),
          });
        }

        expect(errors.length, JSON.stringify(Array.from(uniqueErrors.values()), null, 2)).equal(0);
      },
    });

    if (isPublicApi(operation)) {
      list.add({
        title: `HTTP 200: options request returns cors headers`,
        skip: () => shouldSkip,
        task: async function () {
          operation.path = getUrl(path);
          const res = await request(operation, 'preflight');
          this.requestConfig = res.config;

          expect(res.status, res.error).equal(200);
          expect(res.duration).lessThan(5000);

          // check cors headers
          expectPathToEqual(res, 'headers["access-control-allow-origin"]', '*');
          expectPathToEqual(res, 'headers["access-control-allow-headers"]', '*');
          expectPathToEqual(res, 'headers["access-control-allow-methods"]', '*');
        },
      });
    }
  }

  return suites;
}

const CREATE_NOTIFICATIONS_COUNT = 10;
const MAX_SETUP_ATTEMPTS = 4;

async function main() {
  const spec = (await swagger.dereference(specFile)) as OpenAPIV3.Document;
  const operations = getOperations(spec);

  // check if api_key, api_secret and user_email are set otherwise throw an error
  if (!process.env.API_KEY || !process.env.API_SECRET || !process.env.USER_EMAIL) {
    throw new Error('Please set the API_KEY, API_SECRET and USER_EMAIL environment variables to run the smoke tests');
  }

  if (!serverUrl) {
    throw new Error('Please set the SERVER_URL environment variable to run the smoke tests');
  }

  console.log(`Running smoke tests against ${serverUrl.split('.').join('_')}`);

  const newNotificationIds = await Promise.all(
    Array.from({ length: CREATE_NOTIFICATIONS_COUNT }).map(() =>
      request(
        operations.find((x) => x.operationId === 'notifications-create'),
        'authenticated',
      ).then((x) => x.data),
    ),
  );

  if (newNotificationIds.length === 0) {
    throw new Error('Failed to create new notifications during test setup');
  }

  // As the created notifications are processes via an (async) job runner, we might need to try fetching them a few times.
  for (let attempt = 1; attempt <= MAX_SETUP_ATTEMPTS; attempt++) {
    if (URL_PARAM_VALUES.broadcast_id.length === 0) {
      URL_PARAM_VALUES.broadcast_id = await request(
        operations.find((x) => x.operationId === 'broadcasts-list'),
        'authenticated',
        { per_page: 50 },
      ).then((x) => (x.data.broadcasts || []).filter((x) => x.status !== 'enqueued').map((x) => x.id));
    }

    let broadcastsReady = false;
    // it takes a while before the notifications are added to the broadcast
    if (URL_PARAM_VALUES.broadcast_id.length) {
      const operation = operations.find((x) => x.operationId === 'broadcasts-notifications-list');
      await request({ ...operation, path: getUrl(operation.path, false) }, 'authenticated').then((x) => {
        broadcastsReady = x.data.notifications?.length > 0;
      });
    }

    if (URL_PARAM_VALUES.notification_id.length === 0) {
      URL_PARAM_VALUES.notification_id = await request(
        operations.find((x) => x.operationId === 'notifications-list'),
        'authenticated',
        { per_page: 50 },
      ).then((x) => (x.data.notifications || []).map((x) => x.id));
    }

    // end the loop when we have enough notifications
    if (
      broadcastsReady &&
      [URL_PARAM_VALUES.broadcast_id, URL_PARAM_VALUES.notification_id].every(
        (x) => x.length >= CREATE_NOTIFICATIONS_COUNT,
      )
    ) {
      break;
    }

    // prevent infinite loop
    if (attempt === MAX_SETUP_ATTEMPTS) break;

    // Exponential backoff, with a max of 2 minutes.
    const delay = Math.min(3 ** attempt, 120);
    if (broadcastsReady) {
      console.log(`Not enough notifications created yet, waiting ${delay} seconds before trying again.`);
    } else {
      console.log(`Broadcasts not ready yet, waiting ${delay} seconds before trying again.`);
    }
    await setTimeout(delay * 1000);
  }

  if (URL_PARAM_VALUES.notification_id.length < CREATE_NOTIFICATIONS_COUNT) {
    throw new Error(
      "Ran out of notifications to act upon. Some have been created, but aren't ready yet. Please rerun this test in a sec",
    );
  }

  // We need a combination of new notifications and existing ones, as the existing ones might not be enough - as some
  // tests are destructive, and new notifications take a while to be created.
  URL_PARAM_VALUES.notification_id = Array.from(new Set([...URL_PARAM_VALUES.notification_id, ...newNotificationIds]));

  const suites = createTests(operations);
  await suites.run().catch(() => {
    process.exit(1);
  });

  const errored = suites.err.length > 0;
  if (!errored) return;

  console.log('\n---- Error Summary ----\n');
  for (const err of suites.err) {
    console.log(`${chalk.red('✖')} ${err.task.listr.parentTask.title}`);
    console.log(`  ${chalk.red('✖')} ${err.task.title}`);
    console.log(`    error: ${err.message}`);
    if ('requestConfig' in err.task) {
      console.log(`    request: ${toCurl(err.task.requestConfig)}`);
    }
  }

  process.exit(1);
}

main();
