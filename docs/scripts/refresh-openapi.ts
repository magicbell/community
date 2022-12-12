#!/usr/bin/env zx
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import 'zx/globals';
import { fetchOpenAPISpec, OPENAPI_FILE } from '../lib/openapi';

async function main() {
  const spec = await fetchOpenAPISpec({ force: true });

  await mkdir(dirname(OPENAPI_FILE), { recursive: true });
  await fs.writeJSON(OPENAPI_FILE, spec, { spaces: 2 });
  console.log(`openapi: refreshed ${OPENAPI_FILE}`);
}

main();
