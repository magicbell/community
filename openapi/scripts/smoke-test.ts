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

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const specFile = argv.spec || process.env.INPUT_SPEC || 'spec/openapi.json';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const URL_PARAM_VALUES = {
  notification_id: [],
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
      methods.push(Object.assign(operation, { path, method }));
    }
  }

  return methods;
}

function toCurl({ method, baseURL, url, data, headers }: AxiosRequestConfig) {
  return [
    `curl -X ${method.toUpperCase()}`,
    `${baseURL}/${url.replace(/^\//, '')}`,
    Object.entries(headers)
      .map(([key, value]) => `-H '${key}: ${value}'`)
      .join(' '),
    data && `-d '${JSON.stringify(data)}'`,
  ].join(' ');
}

async function request(operation: Operation, type: 'no-headers' | 'authenticated' | 'invalid-auth') {
  const start = Date.now();

  const headers = type === 'no-headers' ? {} : getAuthHeaders(type === 'authenticated', operation);
  const data = getBodyContent(operation.requestBody).example;

  // HACK: this ain't really nice, is it?
  if (operation.operationId.startsWith('notification-preferences')) {
    headers['accept-version'] = 'v2';
  }

  const config: AxiosRequestConfig = {
    baseURL: process.env.SERVER_URL,
    method: operation.method,
    url: operation.path,
    validateStatus: () => true,
    data,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'user-agent': 'magicbell-openapi-smoke-test',
      ...headers,
    },
  };

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

  return Object.assign(response, { duration, config: config, error });
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

function getUrl(path: string) {
  const urlParams = (path.match(/{\w+}/g) || []).map((param) => param.replace(/[{}]/g, ''));

  // if a request depends on urlParams, we'll use earlier created resources
  const params = Object.fromEntries(
    urlParams.map((param) => {
      const source = URL_PARAM_VALUES[param];
      if (!source) throw new Error(`No reserved values for param ${param}`);
      const value = source.shift();
      if (!value) throw new Error(`No more values for param ${param}`);
      return [param, value];
    }),
  );

  return path.replace(/{([\s\S]+?)}/g, ($0, $1) => encodeURIComponent(params[$1] || ''));
}

function createTests(operations) {
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

    list.add({
      title: 'HTTP 404: request without authentication headers return 404 not found',
      task: async () => {
        const res = await request(operation, 'no-headers');
        expect(res.status, res.error).equal(404);
        expect(res.duration).lessThan(5000);
      },
    });

    list.add({
      title: 'HTTP 401: request with invalid auth headers returns 401 unauthorized',
      task: async () => {
        const res = await request(operation, 'invalid-auth');
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
      operationId === 'imports-get';

    const code = getSuccessStatusCode(operation);
    list.add({
      title: `HTTP ${code}: request with valid api key and payload returns expected response`,
      skip: () => shouldSkip,
      task: async () => {
        operation.path = getUrl(path);

        const res = await request(operation, 'authenticated');
        expect(res.status, res.error).equal(code);
        expect(res.duration).lessThan(5000);

        // We're adjust the schema, as there's a difference between `input type` and `return type`, and
        // the `components.schemas` currently only hold input types.
        const schema = getBodyContent(operation.responses[res.status]).schema;
        ajv.validate({ ...schema, required: [] }, res.data);

        const errors = (ajv.errors || []).filter(
          (x) =>
            x.keyword !== 'required' && // ignore required fields, as api might return partial objects
            x.params?.format !== 'uri' && // ignore uri format, action_url might be an empty string, which is not a valid uri
            x.instancePath !== '/subscriptions/2/categories/0/reason', // difference between input && output
        );
        expect(errors.length).equal(0);
      },
    });
  }

  return suites;
}

async function main() {
  const spec = (await swagger.dereference(specFile)) as OpenAPIV3.Document;
  const operations = getOperations(spec);

  const newNotificationIds = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      request(
        operations.find((x) => x.operationId === 'notifications-create'),
        'authenticated',
      ).then((x) => x.data),
    ),
  );

  if (newNotificationIds.length === 0) {
    throw new Error('Failed to create new notifications during test setup');
  }

  URL_PARAM_VALUES.notification_id = await request(
    operations.find((x) => x.operationId === 'notifications-list'),
    'authenticated',
  ).then((x) => x.data.notifications.map((x) => x.id));

  if (URL_PARAM_VALUES.notification_id.length === 0) {
    throw new Error(
      "Ran out of notifications to act upon. Some have been created, but aren't ready yet. Please rerun this test in a sec",
    );
  }

  // We need a combination of new notifications and existing ones, as the existing ones might not be enough - as some
  // tests are destructive, and new notifications take a while to be created.
  URL_PARAM_VALUES.notification_id = Array.from(new Set([...URL_PARAM_VALUES.notification_id, ...newNotificationIds]));

  await createTests(operations)
    .run()
    .catch(() => {
      process.exit(1);
    });
}

main();
