import { OpenAPIV3 } from 'openapi-types';
import React from 'react';
import { Tag } from '@darkmagic/react';

interface Props {
  param?: OpenAPIV3.ParameterObject;
}

export default function Parameter({ param }: Props) {
  if (!param) return null;
  return (
    <li className="list-none p-2">
      <p className="font-mono flex items-center mb-0.5">
        <span className="bg-bgDefault text-highlight p-1 rounded">{param.name}</span>
        {param.required && <span className="text-error mx-4 text-xs">Required</span>}
      </p>
      <p
        className="opacity-80 m-0"
        dangerouslySetInnerHTML={{
          __html: param.description?.replace(/\n/g, '<br/>') || '',
        }}
      />
      <Tag css={{ mt: '8px' }}>
        {/* @ts-ignore */}
        {param.schema?.type}
      </Tag>
    </li>
  );
}
