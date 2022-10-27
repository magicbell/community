import { OpenAPIV3 } from 'openapi-types';
import React from 'react';
import Operation from './Operation';

interface Props {
  pathKey: string;
  path?: OpenAPIV3.PathItemObject;
}

export default function Path({ pathKey, path }: Props) {
  return (
    <>
      {path?.post ? (
        <Operation pathKey={pathKey} operation={path.post} method="POST" />
      ) : null}
      {path?.put ? (
        <Operation pathKey={pathKey} operation={path.put} method="PUT" />
      ) : null}
      {path?.get ? (
        <Operation pathKey={pathKey} operation={path.get} method="GET" />
      ) : null}
      {path?.delete ? (
        <Operation pathKey={pathKey} operation={path.delete} method="DELETE" />
      ) : null}
    </>
  );
}
