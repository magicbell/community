import React from 'react';
import PageLink from './PageLink';
import { getLink } from '../graphql/link';

interface Props {
  query: any;
  type: 'mutation' | 'query' | 'input' | 'type';
}

const colors = {
  query: 'text-green-500',
  mutation: 'text-blue-500',
  input: 'text-purple-500',
  type: 'text-orange-500',
};

const abbreviations = {
  query: 'qry',
  mutation: 'mut',
  input: 'inp',
  type: 'typ',
};

export default function QueryLink({ query, type }: Props) {
  if (!query) return null;

  const [summary] = (query.description || query.name).split('\n');
  const color = colors[type] || colors.query;

  return (
    <PageLink
      to={`/graphql-api/reference#${getLink(summary)}`}
      name={
        <div className="flex space-x-2">
          <div className="mt-1">
            <span
              className={`uppercase font-mono w-6 block text-right ${color}`}
              style={{ fontSize: '10px', lineHeight: 1.3 }}
            >
              {abbreviations[type] || 'post'}
            </span>
          </div>
          <div>{summary}</div>
        </div>
      }
      style={{ padding: '6px 0' }}
    />
  );
}
