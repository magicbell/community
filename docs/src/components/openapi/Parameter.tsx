import { OpenAPIV3 } from 'openapi-types';
import React from 'react';

interface Props {
  param?: OpenAPIV3.ParameterObject;
}

export default function Parameter({ param }: Props) {
  if (!param) return null;
  return (
    <li className="list-none p-2">
      <p className="font-mono flex items-center mb-0.5">
        {param.name}
        {param.required && <span className="text-red-500 mx-4 text-xs">required</span>}
      </p>
      <p
        className="opacity-80 m-0"
        dangerouslySetInnerHTML={{
          __html: param.description?.replace(/\n/g, '<br/>') || '',
        }}
      />
      <p className="opacity-80 m-0 capitalize">
        {/* @ts-ignore */}
        {param.schema?.type}
      </p>
    </li>
  );
}
