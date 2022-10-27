import { OpenAPIV3 } from 'openapi-types';
import { includes } from 'ramda';
import React from 'react';
import HeaderParameters from './HeaderParameters';
import QueryParameters from './QueryParameters';
import Request from './Request';
import RequestBody from './RequestBody';
import Responses from './Responses';
import { getLink } from '../graphql/link';

interface Props {
  pathKey?: string;
  operation: OpenAPIV3.OperationObject;
  method?: string;
}

export default function Operation({ pathKey, operation, method }: Props) {
  if (!operation) return null;

  const realTimeEnabled = includes('real-time', operation.tags || []);
  const href = getLink(operation.summary || '');

  return (
    <article id={operation.operationId} className="py-36 border-t">
      <h2 className="mt-0" id={href}>
        <a href={`#${href}`}>{operation.summary}</a>
      </h2>
      {realTimeEnabled ? (
        <p className="text-xs rounded bg-blue-50 px-3 py-2 text-blue-600 uppercase font-mono mb-4 inline-block">
          real-time
        </p>
      ) : null}
      <div className="flex space-x-0 xl:space-x-4 flex-wrap xl:flex-nowrap">
        <main className="w-full xl:w-1/2">
          <p
            dangerouslySetInnerHTML={{
              __html: operation.description?.replace(/\n/g, '<br/>') || '',
            }}
          />
          <HeaderParameters
            parameteres={operation.parameters as OpenAPIV3.ParameterObject[]}
          />
          <QueryParameters
            parameteres={operation.parameters as OpenAPIV3.ParameterObject[]}
          />
          <RequestBody
            requestBody={operation.requestBody as OpenAPIV3.RequestBodyObject}
          />
        </main>
        <aside className="w-full xl:w-1/2 space-y-12">
          <Request method={method} location={pathKey} operation={operation} />
          <Responses responses={operation.responses} />
        </aside>
      </div>
    </article>
  );
}
