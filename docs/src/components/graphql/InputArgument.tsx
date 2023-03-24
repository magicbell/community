import { GraphQLArgument, GraphQLNonNull } from 'graphql';
import React from 'react';
import { isGraphqlInputObjectType } from './lib';
import { getLink } from './link';
import { Tag } from '@darkmagic/react'

interface Props {
  argument: GraphQLArgument;
}

export default function InputArgument({ argument }: Props) {
  if (!argument) return null;

  const { name, description } = argument;

  const type =
    argument.type instanceof GraphQLNonNull ? argument.type.ofType : argument.type;
  const isInputType = isGraphqlInputObjectType(type);
  const typeName = argument.type.toString();

  return (
    <li className="list-none p-2">
      <p className="font-mono flex items-center mb-0.5">
        <span className="bg-bgDefault text-highlight p-1 rounded">{name}</span>
      </p>
      {description && (
        <p
          className="opacity-80 m-0"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      )}
      <Tag className="mt-2">
        {isInputType ? <a href={`#${getLink(type)}`}>{typeName}</a> : typeName}
      </Tag>
    </li>
  );
}
