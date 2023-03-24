import { OpenAPIV3 } from 'openapi-types';
import { includes, init, last } from 'ramda';
import React from 'react';
import CollapsedSection from '../CollapsedSection';
import { Tag } from '@darkmagic/react';

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
    <div className="p-3">
      <p className="font-mono white break-all mb-0.5">
        <span className="bg-bgDefault rounded p-1">
          {objectParents.length > 0 ? <>{objectParents.join('.') + '.'}</> : null}
          <span className="text-highlight">{propertyName}</span>
        </span>
        {required && <span className="text-error mx-4 text-xs">Required</span>}
      </p>
      <p className="m-0 opacity-80">{object.description}</p>
      <Tag css={{ mt: '8px' }}>{object.type}</Tag>
      {object.maxLength ? (
        <Tag css={{ mt: '8px', ml: '6px' }}>Max length: {object.maxLength}</Tag>
      ) : null}
      {object.minLength ? (
        <Tag css={{ mt: '8px', ml: '6px' }}>Min length: {object.minLength}</Tag>
      ) : null}
      {object.maxItems ? (
        <Tag css={{ mt: '8px', ml: '6px' }}>Max items: {object.maxItems}</Tag>
      ) : null}
      {object.minItems ? (
        <Tag css={{ mt: '8px', ml: '6px' }}>Min items: {object.minItems}</Tag>
      ) : null}
    </div>
  );
}
