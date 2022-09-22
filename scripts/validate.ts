#!/usr/bin/env zx
import 'zx/globals';

import swagger from '@apidevtools/swagger-parser';
import jsonpath from 'jsonpath';

const showHelp = argv.help;
const specFile = argv.spec || 'spec/openapi.json';

if (showHelp) {
  console.log('Usage: yarn validate [--spec <spec-file>]');
  process.exit(0);
}

const spec = await fs.readJSON(path.resolve(specFile));

const api = await swagger.validate(spec as any).catch((error) => {
  console.error(`Error: ${specFile} did not pass swagger validation!`, error.message);
  process.exit(1);
});

const operationIds = jsonpath.query(api, '$..operationId');
const duplicateOperationIds = operationIds.filter((item, index) => operationIds.indexOf(item) !== index);
if (duplicateOperationIds.length > 0) {
  console.error(`Error: ${specFile} contains duplicate operationIds!`, duplicateOperationIds);
  process.exit(1);
}
