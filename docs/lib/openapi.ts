import swagger from '@apidevtools/swagger-parser';
import fs from 'fs';
import { OpenAPI, OpenAPIV3 } from 'openapi-types';

export const OPENAPI_FILE = 'docs/rest-api/openapi.json';

const readOpenAPIFile = (file: string) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return null;
  }
};

const defaultOptions = { force: false, dereference: false };
export async function fetchOpenAPISpec(
  options: Partial<typeof defaultOptions> = defaultOptions,
): Promise<OpenAPIV3.Document> {
  options = { ...defaultOptions, ...options };
  const json = readOpenAPIFile(OPENAPI_FILE);

  if (!json) {
    throw new Error(
      'Failed to obtain openapi spec from the web or cache, please connect to the internet and run `yarn refresh-openapi` (or refresh this page) to fetch the spec from our openapi repo, and store it in cache.',
    );
  }

  const schema = (await swagger.parse(
    json as OpenAPI.Document,
  )) as unknown as OpenAPIV3.Document;

  if (options.dereference) {
    return (await swagger.dereference(schema)) as unknown as OpenAPIV3.Document;
  }

  return schema;
}

export function getApiLinks(spec: OpenAPIV3.Document) {
  return Object.keys(spec.paths).flatMap((pathName) => {
    const path = spec.paths[pathName as keyof typeof spec.paths] || {};

    return Object.keys(path).map((method) => {
      const { operationId, summary } = path[
        method as keyof typeof path
      ] as OpenAPIV3.OperationObject;

      return { path: pathName, method, operationId, summary };
    });
  });
}
