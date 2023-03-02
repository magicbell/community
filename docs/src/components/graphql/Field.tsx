import { GraphQLField, GraphQLObjectType, GraphQLSchema } from 'graphql';
import React from 'react';
import FieldArguments from './FieldArguments';
import Headers from './Headers';
import Request from './Request';
import { getLink } from './link';
import { getGraphqlInputTypes } from './lib';

interface Props {
  field: GraphQLField<any, any, any>;
  operation: GraphQLObjectType<any, any>;
  schema: GraphQLSchema;
}

export default function Field({ field, operation, schema }: Props) {
  if (!field) return null;

  const { args, description: descriptionNode } = field;

  const [title, description] = descriptionNode
    ? descriptionNode.replace(/\n+/, ':::').split(':::')
    : ['', ''];
  const href = getLink(title);
  const inputTypes = getGraphqlInputTypes(args);

  return (
    <article id={href} className="py-36 border-t mb-4">
      <h2 className="mt-0 inline-block">
        <a href={`#${href}`}>{title}</a>
      </h2>
      <p className="text-xs rounded bg-blue-600 px-3 py-2 text-blue-50 uppercase font-mono inline-block relative bottom-1 ml-5">
        {operation.name}
      </p>
      <div className="flex space-x-0 xl:space-x-4 flex-wrap xl:flex-nowrap">
        <main className="w-full xl:w-1/2">
          <p
            dangerouslySetInnerHTML={{
              __html: description?.replace(/\n/g, '<br/>'),
            }}
          />
          <Headers field={field} />
          {args ? <FieldArguments args={args} /> : null}
          {inputTypes.map((type) => (
            <FieldArguments
              key={type.name}
              args={Object.values(type.getFields())}
              caption={
                <>
                  <span
                    className={
                      'font-mono text-sm py-1 px-2 text-xs uppercase rounded-sm bg-violet-600 text-violet-50 mr-2'
                    }
                  >
                    INPUT
                  </span>
                  {type.name}
                </>
              }
            />
          ))}
        </main>
        <aside className="w-full xl:w-1/2 space-y-12">
          <Request field={field} schema={schema} operation={operation} />
        </aside>
      </div>
    </article>
  );
}
