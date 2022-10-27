/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker';
import { OpenAPIV3 } from 'openapi-types';
import pupa from 'pupa';

const HTTPSnippet = require('httpsnippet');
const httparty = require('./httpsnippet-ruby-httparty');
const requests = require('./httpsnippet-python-requests');

try {
  HTTPSnippet.addTargetClient('ruby', httparty);
  HTTPSnippet.addTargetClient('python', requests);
} catch (err) {
  /* intentionally left blank */
}

const BASE_URL = 'https://api.magicbell.com'; // @todo Take it from the OpenAPI file

// To generate the same values accross example
const TEMPLATE_CONTEXT = {
  notification_id: '7fb3ce9f-a866-4dff-8ce8-2f64f7c5ed4c',
  user_id: faker.datatype.uuid(),
  email: 'richard@example.com',
  user_email: 'richard@example.com',
  external_id: '4c3523c7-8a98-4933-9fcd-394d72940a3d',
  device_token: faker.random.alphaNumeric(64),
  x_magicbell_api_key: '[MAGICBELL_API_KEY]',
  x_magicbell_api_secret: '[MAGICBELL_API_SECRET]',
  x_magicbell_user_external_id: '[USER_ID]',
  x_magicbell_user_email: '[USER_EMAIL]',
  authorization: 'Bearer [TOKEN]',
  workspace_id: 134,
  project_id: 419,
};

export function replaceVariables(codeSnippet: string) {
  return pupa(codeSnippet, TEMPLATE_CONTEXT, { ignoreMissing: true });
}

export function buildUrl(url: URL) {
  return replaceVariables(decodeURIComponent(url.href));
}

export function buildRequestSnippet(
  location: string,
  method: string,
  headers: OpenAPIV3.ParameterObject[] | Record<string, any>[],
  data: {
    mimeType: string;
    text: string;
  } | null,
) {
  const headersArray = Object.keys(headers).map((param, index) => ({
    name: headers[index].name,
    value:
      headers[index].content ||
      replaceVariables(`{${headers[index].name.toLowerCase().replace(/-/g, '_')}}`),
  }));

  return new HTTPSnippet({
    method,
    url: buildUrl(new URL(location, BASE_URL)),
    postData: data,
    headers: headersArray,
  });
}
