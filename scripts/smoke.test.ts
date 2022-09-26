import swagger from '@apidevtools/swagger-parser';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import axios, { AxiosRequestConfig } from 'axios';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { OpenAPIV3 } from 'openapi-types';
import path from 'path';
import { beforeAll, describe, expect, test } from 'vitest';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let spec = JSON.parse(fs.readFileSync(path.resolve('spec/openapi.json'), 'utf-8')) as OpenAPIV3.Document;

const URL_PARAM_VALUES = {
  notification_id: [],
  topic: ['acme-inc.orders.1234'],
  device_token: ['x4doKe98yEZ21Kum2Qq39M3b8jkhonuIupobyFnL0wJMSWAZ8zoTp2dyHgV'],
};

beforeAll(async () => {
  spec = (await swagger.dereference(spec)) as OpenAPIV3.Document;

  // get notification-is to act upon
  URL_PARAM_VALUES.notification_id = await request('notifications-list', 'authenticated').then((x) =>
    x.data.notifications.map((x) => x.id),
  );

  if (URL_PARAM_VALUES.notification_id.length === 0) {
    throw new Error('ran out of notifications to act upon');
  }
});

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

async function request(operationId: keyof typeof operationMap, type: 'no-headers' | 'authenticated' | 'invalid-auth') {
  const start = Date.now();

  const operation = operationMap[operationId];
  const headers = type === 'no-headers' ? {} : getAuthHeaders(type === 'authenticated', operation);
  const data = getBodyContent(operation.requestBody).example;

  // HACK: this ain't really nice, is it?
  if (operationId.startsWith('notification-preferences')) {
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
      return [param, source.shift()];
    }),
  );

  return path.replace(/{([\s\S]+?)}/g, ($0, $1) => encodeURIComponent(params[$1] || ''));
}

const operations = getOperations(spec);
const operationMap: Record<string, Operation> = operations.reduce(
  (acc, operation) => Object.assign(acc, { [operation.operationId]: operation }),
  {},
);

for (const operation of operations) {
  const { method, path, operationId } = operation;

  describe(`${method.toUpperCase()} ${path} (id: ${operationId})`, async () => {
    test('HTTP 404: request without authentication headers return 404 - not found', async () => {
      const res = await request(operationId, 'no-headers');
      expect(res.status, res.error).toEqual(404);
      expect(res.duration).toBeLessThan(5000);
    });

    test('HTTP 401: request with invalid auth headers returns 401 - unauthorized', async () => {
      const res = await request(operationId, 'invalid-auth');
      expect(res.status, res.error).toEqual(401);
      expect(res.duration).toBeLessThan(5000);
    });

    // we can't smoke test endpoints depending on input data, as input is created async. Technically, we
    // should be able to deleteNotification({ id: createNotification().id }), but as the create action
    // is done through a job runner (sidekiq) the `delete` will be executed before the `create` is done.
    const shouldSkip =
      operation.path.includes(':{') || operationId.startsWith('users-') || operationId === 'subscriptions-delete';

    const code = getSuccessStatusCode(operation);
    test.skipIf(shouldSkip)(
      `HTTP ${code}: request with valid api key and payload returns expected response`,
      async () => {
        operationMap[operationId].path = getUrl(path);

        const res = await request(operationId, 'authenticated');
        expect(res.status, res.error).toEqual(code);
        expect(res.duration).toBeLessThan(5000);

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
        expect(errors).toEqual([]);
      },
      { timeout: 10_000 },
    );
  });
}
