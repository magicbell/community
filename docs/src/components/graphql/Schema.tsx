import { GraphQLSchema } from 'graphql';
import React from 'react';
import Operation from './Operation';
import { isGraphqlInputObjectType } from './lib';
import { Type } from './Type';

interface Props {
  schema: GraphQLSchema;
}

export default function Schema({ schema }: Props) {
  if (!schema) return null;

  const query = schema.getQueryType();
  const mutation = schema.getMutationType();

  const config = schema.toConfig();
  const inputTypes = config.types.filter(isGraphqlInputObjectType);

  return (
    <section>
      {query && <Operation schema={schema} operation={query} />}
      {mutation && <Operation schema={schema} operation={mutation} />}

      {inputTypes.map((type) => (
        <Type key={type.name} type={type} schema={schema} />
      ))}
    </section>
  );
}
