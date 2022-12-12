#!/usr/bin/env zx
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import 'zx/globals';
import { API_SPEC_FILE, fetchOpenAPISpec } from '../lib/openapi';

async function main() {
  const spec = await fetchOpenAPISpec({ force: true });

  await mkdir(dirname(API_SPEC_FILE), { recursive: true });
  await fs.writeJSON(API_SPEC_FILE, spec, { spaces: 2 });
  console.log(`openapi: refreshed ${API_SPEC_FILE}`);
}

main();
