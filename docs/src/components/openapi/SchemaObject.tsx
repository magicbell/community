import { OpenAPIV3 } from 'openapi-types';
import { includes, init, last } from 'ramda';
import React from 'react';
import CollapsedSection from '../CollapsedSection';

interface Props {
  object?: OpenAPIV3.SchemaObject;
  objectPathAcc: string[];
  required?: boolean;
}

export default function SchemaObject({
  object,
  objectPathAcc = [],
  required = false,
}: Props) {
  if (!object) return null;
  if (object.type === 'object' && object.properties)
    return (
      <CollapsedSection className="divide-y">
        {Object.keys(object.properties).map((propertyName, index) => {
          return (
            <SchemaObject
              key={index}
              object={object.properties?.[propertyName] as OpenAPIV3.SchemaObject}
              objectPathAcc={[...objectPathAcc, propertyName]}
              required={includes(propertyName, object.required || [])}
            />
          );
        })}
      </CollapsedSection>
    );

  const objectParents = init(objectPathAcc);
  const propertyName = last(objectPathAcc);
  return (
    <div className="p-2">
      <p className="font-mono white break-all mb-0.5">
        {objectParents.length > 0 ? (
          <span className="opacity-60">{objectParents.join('.') + '.'}</span>
        ) : null}
        <span>{propertyName}</span>
        {required && <span className="text-red-500 mx-4 text-xs">required</span>}
      </p>
      <p className="m-0 opacity-80">{object.description}</p>
      <p className="mb-0 opacity-80 capitalize mt-2">{object.type}</p>
      {object.maxLength ? (
        <p className="mb-0 opacity-80">Max length: {object.maxLength}</p>
      ) : null}
      {object.minLength ? (
        <p className="mb-0 opacity-80">Min length: {object.minLength}</p>
      ) : null}
      {object.maxItems ? (
        <p className="mb-0 opacity-80">Max items: {object.maxItems}</p>
      ) : null}
      {object.minItems ? (
        <p className="mb-0 opacity-80">Min items: {object.minItems}</p>
      ) : null}
    </div>
  );
}
