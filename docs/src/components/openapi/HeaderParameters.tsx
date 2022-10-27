import { OpenAPIV3 } from 'openapi-types';
import { reject } from 'ramda';
import React from 'react';
import Parameter from './Parameter';

interface Props {
  parameteres?: OpenAPIV3.ParameterObject[];
}

export default function HeaderParameters({ parameteres = [] }: Props) {
  const headerParams = reject(
    (param: OpenAPIV3.ParameterObject) => param.in !== 'header',
    parameteres,
  );

  if (!headerParams.length) return null;
  return (
    <div className="mt-8 mb-12">
      <p className="uppercase text-sm">HTTP headers</p>
      <ul className="border border-gray-200 rounded divide-y m-0">
        {headerParams.map((param, index) => (
          <Parameter key={index} param={param} />
        ))}
      </ul>
    </div>
  );
}
