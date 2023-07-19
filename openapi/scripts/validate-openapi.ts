#!/usr/bin/env zx
import 'zx/globals';

import swagger from '@apidevtools/swagger-parser';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import jsonpath from 'jsonpath';
import { OpenAPIV3 } from 'openapi-types';

const showHelp = argv.help;
const specFile = argv.spec || process.env.INPUT_SPEC || 'spec/openapi.json';

if (showHelp) {
  console.log('Usage: yarn validate [--spec <spec-file>]');
  process.exit(0);
}

const ajv = new Ajv();
addFormats(ajv);

const spec = await fs.readJSON(path.resolve(specFile));

const api = await swagger.dereference(spec as any).catch((error) => {
  console.error(`Error: ${specFile} did not pass swagger validation!`, error.message);
  process.exit(1);
});

const errors: string[] = [];

function assertUniqueOperationIds() {
  const operationIds = jsonpath.query(api, '$..operationId');
  const duplicateOperationIds = operationIds.filter((item, index) => operationIds.indexOf(item) !== index);

  for (const operationId of duplicateOperationIds) {
    errors.push(`Operation ID "${operationId}" is not unique.`);
  }
}

const httpMethods = Object.values(OpenAPIV3.HttpMethods);

function isOperationObject(key: string, value: any): value is OpenAPIV3.OperationObject {
  return httpMethods.includes(key as OpenAPIV3.HttpMethods);
}

function assertOperationIdsMatchConvention() {
  for (const [path, pathObj] of Object.entries(api.paths)) {
    for (const [method, operation] of Object.entries<OpenAPIV3.OperationObject>(pathObj)) {
      // only validate operations
      if (!isOperationObject(method, operation)) continue;

      const operationId = operation.operationId;
      if (!operationId) {
        errors.push(`Operation ID is missing for ${path}/${method}.`);
      }

      const entity = path.split('/').filter(Boolean)[0].replace(/_/g, '-');
      const singleEntity = entity.replace(/s$/, '');
      const isNamespaced = operationId.startsWith(entity + '-');
      const repeatsEntity = operationId
        .substr(entity.length + 1)
        .split('-')
        .some((segment, idx) => idx > 0 && (segment === singleEntity || segment === entity));

      if (!isNamespaced || repeatsEntity) {
        errors.push(`Operation ID "${operationId}" does not follow the convention of {namespace}-{method-name}.`);
      }
    }
  }
}

function assertPathItemHasSummary() {
  for (const [path, pathObj] of Object.entries(api.paths)) {
    const depth = path.split('/').filter(Boolean).length;

    // only validate top-level paths, for nested paths summary is optional
    if (depth === 1 && !pathObj.summary) {
      errors.push(`Summary is missing for "${path}".`);
    }
  }
}

function assertRequestExamplesMatchSchema() {
  for (const [_path, pathObj] of Object.entries(api.paths)) {
    for (const [_method, operation] of Object.entries<OpenAPIV3.OperationObject>(pathObj)) {
      if (!operation.requestBody || !('content' in operation.requestBody)) continue;

      const content = operation.requestBody.content?.['application/json'];
      if (!content.example) {
        errors.push(`Request example for ${operation.operationId} is missing.`);
        continue;
      }

      const valid = ajv.validate(content.schema, content.example);
      if (!valid) {
        errors.push(
          `Request example for ${operation.operationId} does not match schema, ${ajv.errors
            ?.map((e) => `field '${e.keyword}' ${e.message} (path ${e.instancePath})`)
            .join(', ')}`,
        );
      }
    }
  }
}

function assertResponseExamplesMatchSchema() {
  for (const [_path, pathObj] of Object.entries(api.paths)) {
    for (const [_method, operation] of Object.entries<OpenAPIV3.OperationObject>(pathObj)) {
      if (!operation.responses) continue;

      for (const [statusCode, response] of Object.entries(operation.responses)) {
        const content = (response as OpenAPIV3.ResponseObject).content?.['application/json'];

        // some status codes don't have content
        if (!content && ['204', '404'].includes(statusCode)) continue;

        if (!content) {
          errors.push(`Response for ${operation.operationId} (${statusCode}) is missing content.`);
          continue;
        }

        if (!content.example) {
          errors.push(`Response for ${operation.operationId} (${statusCode}) is missing example.`);
          continue;
        }

        if (!content.schema) {
          errors.push(`Response for ${operation.operationId} (${statusCode}) is missing schema.`);
          continue;
        }

        const valid = ajv.validate(content.schema, content.example);
        if (!valid) {
          errors.push(
            `Response example for ${operation.operationId} (${statusCode}) does not match schema, ${ajv.errors
              ?.map((e) => `field '${e.keyword}' ${e.message} (path ${e.instancePath})`)
              .join(', ')}`,
          );
        }
      }
    }
  }
}

function assertPathsMatchConvention() {
  for (const path of Object.keys(api.paths)) {
    if (path.includes('(') || path.includes(')')) {
      errors.push(`Path "${path}" contains parentheses, please use curly braces for path params.`);
    }

    const openBracesCount = path.split('{').length - 1;
    const closeBracesCount = path.split('}').length - 1;

    if (openBracesCount !== closeBracesCount) {
      errors.push(`Path "${path}" has mismatched braces, { and } must be balanced.`);
    }
  }
}

assertPathItemHasSummary();
assertUniqueOperationIds();
assertOperationIdsMatchConvention();
assertRequestExamplesMatchSchema();
assertResponseExamplesMatchSchema();
assertPathsMatchConvention();

for (const error of errors) {
  console.log(chalk.redBright(error));
}

if (errors.length) {
  console.log('');
  console.log(chalk.redBright(`Found ${errors.length} errors.`));
}

process.exit(errors.length ? 1 : 0);
