import { GraphQLField } from 'graphql';
import { filter, isEmpty } from 'ramda';
import React from 'react';
import { headers } from '../../../lib/graphql';
import Parameter from '../openapi/Parameter';

interface Props {
  field: GraphQLField<any, any, any>;
}

export default function Headers({ field }: Props) {
  if (!field) return null;

  const directives = field.astNode?.directives || [];
  const requiresAdminRole = !isEmpty(
    filter((directive) => directive.name.value === 'adminRequired', directives),
  );
  const requestHeaders = requiresAdminRole
    ? [headers['X-MAGICBELL-API-KEY'], headers['X-MAGICBELL-API-SECRET']]
    : [
        headers['X-MAGICBELL-API-KEY'],
        headers['X-MAGICBELL-USER-EXTERNAL-ID'],
        headers['X-MAGICBELL-USER-EMAIL'],
        headers['X-MAGICBELL-USER-HMAC'],
      ];

  return (
    <div className="mt-8 mb-12">
      <p className="uppercase text-sm">HTTP headers</p>
      <ul className="border border-outlineDark rounded divide-y m-0">
        {requestHeaders.map((header, index) => (
          // @ts-ignore
          <Parameter key={index} param={header} />
        ))}
      </ul>
    </div>
  );
}
