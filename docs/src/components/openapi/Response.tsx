import { OpenAPIV3 } from 'openapi-types';
import React from 'react';
import HighlightedCode from '../code/HighlightedCode';

interface Props {
  title: string;
  response?: OpenAPIV3.ResponseObject;
}

export default function Response({ title, response }: Props) {
  if (!response) return null;
  const code = response.content?.['application/json'].example;

  return (
    <HighlightedCode title={title} className="json">
      {JSON.stringify(code || '', null, 2)}
    </HighlightedCode>
  );
}
