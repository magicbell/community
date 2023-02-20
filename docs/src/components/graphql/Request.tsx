import { query, mutation } from 'gql-query-builder';
import { GraphQLField, GraphQLObjectType, GraphQLSchema } from 'graphql';
import prettier from 'prettier';
import parserGraphql from 'prettier/parser-graphql';
import { filter, isEmpty } from 'ramda';
import React from 'react';
import { buildRequestSnippet } from '../../../lib/codeSnippet';
import { buildQueryFields, headers } from '../../../lib/graphql';
import HighlightedCode from '../code/HighlightedCode';
import Tabs from '../tabs/Tabs';

interface Props {
  field: GraphQLField<any, any, any>;
  schema: GraphQLSchema;
  operation: GraphQLObjectType<any, any>;
}

export default function Request({ field, schema, operation }: Props) {
  if (!field) return null;

  const { name, type, astNode } = field;
  const directives = astNode?.directives || [];
  const requiresAdminRole = !isEmpty(
    filter((directive) => directive.name.value === 'adminRequired', directives),
  );

  const nonRequiredType = type.toString().replace(/!$/, '');
  const node = schema.getTypeMap()[nonRequiredType] as GraphQLObjectType | null;

  const typeFn = /mutation/i.test(operation.name) ? mutation : query;
  const gqlQuery = typeFn({
    operation: name,
    fields: node ? buildQueryFields(node) : [],
  });

  const snippetHeaders = requiresAdminRole
    ? [headers['X-MAGICBELL-API-KEY'], headers['X-MAGICBELL-API-SECRET']]
    : [headers['X-MAGICBELL-API-KEY'], headers['X-MAGICBELL-USER-EXTERNAL-ID']];

  const snippet = buildRequestSnippet(
    'https://api.magicbell.com/graphql',
    'POST',
    [{ name: 'Content-Type', content: 'application/json' }, ...snippetHeaders],
    {
      mimeType: 'application/json',
      text: JSON.stringify({ query: gqlQuery.query }),
    },
  );

  return (
    <div>
      <p className="font-mono text-sm">
        <span
          className={
            'py-1 px-2 text-xs uppercase rounded-sm bg-emerald-500 text-emerald-50'
          }
        >
          POST
        </span>
        {' /graphql'}
      </p>
      <Tabs>
        <div>
          <HighlightedCode title="QUERY" className="graphql" hideHeader noTopBorderRadius>
            {prettier.format(gqlQuery.query, {
              parser: 'graphql',
              plugins: [parserGraphql],
            })}
          </HighlightedCode>
        </div>
        <div>
          <HighlightedCode
            className="language-curl"
            title="cURL"
            hideHeader
            noTopBorderRadius
          >
            {snippet.convert('shell', 'curl')}
          </HighlightedCode>
        </div>
      </Tabs>
    </div>
  );
}
