import { GraphQLArgument } from 'graphql';
import React, { ReactNode } from 'react';
import CollapsedSection from '../CollapsedSection';
import InputArgument from './InputArgument';

interface Props {
  args: readonly GraphQLArgument[];
  caption?: ReactNode;
}

export default function FieldArguments({ args, caption }: Props) {
  if (!args) return null;

  return (
    <div className="mt-8 mb-12">
      <p className={caption ? 'text-md' : 'text-sm uppercase'}>
        {caption || 'GraphQL Arguments'}
      </p>
      <CollapsedSection className="border border-outlineDark rounded divide-y m-0">
        {args.map((argument, index) => (
          <InputArgument key={index} argument={argument} />
        ))}
      </CollapsedSection>
    </div>
  );
}
