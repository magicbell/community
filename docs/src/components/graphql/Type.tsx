import FieldArguments from './FieldArguments';
import React from 'react';
import { GraphQLInputObjectType, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { isGraphqlInputObjectType } from './lib';
import prettier from 'prettier';
import parserGraphql from 'prettier/parser-graphql';
import HighlightedCode from '../code/HighlightedCode';
import Tabs from '../tabs/Tabs';
import { getLink } from './link';

type TypeProps = {
  type: GraphQLInputObjectType | GraphQLObjectType;
  schema: GraphQLSchema;
};

export function Type({ type }: TypeProps) {
  const objectType = isGraphqlInputObjectType(type) ? 'input' : 'type';

  const href = getLink(type);
  const fields = Object.values(type.getFields());

  const code = `${objectType} ${type.name} {
    ${fields.map((field) => `${field.name}: ${field.type.name}`).join('\n')}
  }`;

  return (
    <article id={href} className="py-36 border-t">
      <h2 className="mt-0 inline-block">
        <a href={`#${href}`}>{type.name}</a>
      </h2>
      <p className="text-xs rounded bg-blue-600 px-3 py-2 text-blue-50 uppercase font-mono mb-4 inline-block relative bottom-1 ml-5">
        {objectType}
      </p>
      <div className="flex space-x-0 xl:space-x-4 flex-wrap xl:flex-nowrap">
        <main className="w-full xl:w-1/2">
          <p
            dangerouslySetInnerHTML={{
              __html: (type.description || '').replace(/\n/g, '<br/>'),
            }}
          />
          <FieldArguments args={fields} caption="Fields" />
        </main>
        <aside className="w-full xl:w-1/2 space-y-12">
          <Tabs>
            <div>
              <HighlightedCode
                title="graphql"
                className="graphql"
                hideHeader
                noTopBorderRadius
              >
                {prettier.format(code, {
                  parser: 'graphql',
                  plugins: [parserGraphql],
                })}
              </HighlightedCode>
            </div>
          </Tabs>
        </aside>
      </div>
    </article>
  );
}
