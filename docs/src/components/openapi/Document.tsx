import { OpenAPIV3 } from 'openapi-types';
import React from 'react';
import Path from './Path';

interface Props {
  document: OpenAPIV3.Document;
}

export default function Document({ document }: Props) {
  if (!document?.paths) return null;
  return (
    <section>
      {Object.keys(document?.paths).map((key, index) => (
        <Path key={index} pathKey={key} path={document?.paths[key]} />
      ))}
    </section>
  );
}
