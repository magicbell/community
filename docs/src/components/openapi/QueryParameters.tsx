import { OpenAPIV3 } from 'openapi-types';
import { reject } from 'ramda';
import React from 'react';
import Parameter from './Parameter';

interface Props {
  parameteres?: OpenAPIV3.ParameterObject[];
}

export default function QueryParameters({ parameteres = [] }: Props) {
  const params = reject(
    (param: OpenAPIV3.ParameterObject) => param.in !== 'query',
    parameteres,
  );

  if (!params.length) return null;
  return (
    <div className="mt-8 mb-12">
      <p className="uppercase">Query parameters</p>
      <ul className="border border-outlineDark rounded divide-y m-0">
        {params.map((param, index) => (
          <Parameter key={index} param={param} />
        ))}
      </ul>
    </div>
  );
}
