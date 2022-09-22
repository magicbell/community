#!/usr/bin/env zx
import 'zx/globals';

import swagger from '@apidevtools/swagger-parser';

const showHelp = argv.help;
const specFile = argv.spec || 'spec/openapi.json';

if (showHelp) {
  console.log('Usage: yarn validate [--spec <spec-file>]');
  process.exit(0);
}

try {
  const spec = await fs.readJSON(path.resolve(specFile));
  const { info } = await swagger.validate(spec as any);
  console.log(`API name: ${info.title}, version: ${info.version}`);
} catch (error) {
  console.error(`Error: ${specFile} did not pass swagger validation!`, error.message);
}
