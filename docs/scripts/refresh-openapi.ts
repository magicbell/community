#!/usr/bin/env zx
import 'zx/globals';
import { fetchOpenAPISpec, CACHE_FILE } from '../lib/openapi';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

async function main() {
  const spec = await fetchOpenAPISpec({ force: true });

  await mkdir(dirname(CACHE_FILE), { recursive: true });
  await fs.writeJSON(CACHE_FILE, spec, { spaces: 2 });
  console.log(`openapi: refreshed ${CACHE_FILE}`);
}

main();
