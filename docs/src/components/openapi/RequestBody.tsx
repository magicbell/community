import { OpenAPIV3 } from 'openapi-types';
import React from 'react';
import SchemaObject from './SchemaObject';

interface Props {
  requestBody?: OpenAPIV3.RequestBodyObject;
}

export default function RequestBody({ requestBody }: Props) {
  if (!requestBody) return null;

  const schema = requestBody.content?.['application/json']
    ?.schema as OpenAPIV3.SchemaObject;

  const schemaProperties = schema?.properties as {
    [name: string]: OpenAPIV3.SchemaObject;
  };

  if (!schemaProperties) return null;
  return (
    <div className="mt-8 mb-12 overflow-hidden">
      <p className="uppercase">Body Parameters</p>
      <ul className="border border-outlineDark rounded divide-y m-0">
        {Object.keys(schemaProperties).map((propertyName, index) => (
          <SchemaObject
            key={index}
            object={schemaProperties[propertyName]}
            objectPathAcc={[propertyName]}
          />
        ))}
      </ul>
    </div>
  );
}
