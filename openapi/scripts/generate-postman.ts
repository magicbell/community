#!/usr/bin/env zx
import 'zx/globals';

import Converter from 'openapi-to-postmanv2';
import { promisify } from 'util';

const convertAsync = promisify(Converter.convert);

const specFile = argv.spec || process.env.INPUT_SPEC || 'spec/openapi.json';
const spec = await fs.readJSON(path.resolve(specFile));

// https://github.com/postmanlabs/openapi-to-postman/blob/HEAD/OPTIONS.md
const { result, reason, output } = await convertAsync(
  { type: 'json', data: spec },
  {
    type: 'json',
    data: spec,
  },
);

if (!result) {
  console.log(`Error: ${reason}`);
  process.exit(1);
}

const collection = {
  info: {
    name: spec.info.title,
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  variable: [
    {
      key: 'baseUrl',
      value: spec.servers[0].url,
    },
  ],
  item: output[0].data.item,
};

await fs.writeJSON('spec/postman.json', collection, { spaces: 2, encoding: 'utf-8' });
