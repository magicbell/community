import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import React from 'react';
import Field from './Field';

interface Props {
  operation: GraphQLObjectType<any, any>;
  schema: GraphQLSchema;
}

export default function Operation({ operation, schema }: Props) {
  if (!operation) return null;

  const fields = operation.getFields();

  return (
    <>
      {Object.keys(fields).map((fieldKey, index) => (
        <Field
          key={index}
          field={fields[fieldKey]}
          operation={operation}
          schema={schema}
        />
      ))}
    </>
  );
}
