import React, { useMemo } from 'react';
import PageLink from './PageLink';
import classNames from 'classnames';

import { groupBy, prop } from 'ramda';

export type OpenAPILink = {
  path: string;
  method: string;
  operationId: string;
  summary: string;
};

export default function OpenAPILinks({ links = [] }: { links?: OpenAPILink[] }) {
  const groupedLinks = useMemo(() => groupBy(prop('path'), links), [links]);
  return (
    <div className="divide-y divide-dashed divide-outlineDark px-6">
      {Object.values(groupedLinks).map((path) => {
        return (
          <ul key={path[0].path} className="py-3">
            {Object.values(path).map(({ operationId, method, summary }) => (
              <li key={operationId}>
                <PageLink
                  to={`/rest-api/reference#${operationId}`}
                  name={
                    <div className="flex space-x-2">
                      <div className="mt-1">
                        <span
                          className={classNames(
                            'uppercase font-mono w-6 block',
                            method === 'post' && 'text-emerald-500',
                            method === 'get' && 'text-blue-500',
                            method === 'put' && 'text-violet-500',
                            method === 'delete' && 'text-red-500',
                          )}
                          style={{ fontSize: '10px', lineHeight: 1.3 }}
                        >
                          {method.replace('delete', 'del')}
                        </span>
                      </div>
                      <div>{summary}</div>
                    </div>
                  }
                  style={{ padding: '6px 0' }}
                />
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
