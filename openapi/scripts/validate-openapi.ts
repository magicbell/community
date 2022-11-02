#!/usr/bin/env zx
import 'zx/globals';

import swagger from '@apidevtools/swagger-parser';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import jsonpath from 'jsonpath';
import { OpenAPIV3 } from 'openapi-types';

const showHelp = argv.help;
const specFile = argv.spec || 'spec/openapi.json';

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

function assertOperationIdsMatchConvention() {
  for (const [path, pathObj] of Object.entries(api.paths)) {
    for (const [method, operation] of Object.entries<OpenAPIV3.OperationObject>(pathObj)) {
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

function assertExamplesMatchSchema() {
  for (const [_path, pathObj] of Object.entries(api.paths)) {
    for (const [_method, operation] of Object.entries<OpenAPIV3.OperationObject>(pathObj)) {
      if (!operation.requestBody || !('content' in operation.requestBody)) continue;

      const content = operation.requestBody.content?.['application/json'];
      if (!content.example) continue;

      const valid = ajv.validate(content.schema, content.example);
      if (!valid) {
        errors.push(
          `Example for ${operation.operationId} does not match schema, ${ajv.errors
            ?.map((e) => `field '${e.keyword}' ${e.message} (path ${e.instancePath})`)
            .join(', ')}`,
        );
      }
    }
  }
}

assertUniqueOperationIds();
assertOperationIdsMatchConvention();
assertExamplesMatchSchema();

for (const error of errors) {
  console.log(chalk.redBright(error));
}

process.exit(errors.length ? 1 : 0);
