import { OpenAPIV3 } from 'openapi-types';
import React from 'react';
import Response from './Response';

interface Props {
  responses?: OpenAPIV3.ResponsesObject;
}

export default function Responses({ responses }: Props) {
  if (!responses) return null;
  return (
    <div>
      <p className="uppercase text-sm">Responses</p>
      {Object.keys(responses).map((responseKey, index) => (
        // @ts-ignore
        <Response key={index} title={responseKey} response={responses[responseKey]} />
      ))}
    </div>
  );
}
