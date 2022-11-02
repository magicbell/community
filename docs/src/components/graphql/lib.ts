import {
  GraphQLObjectType,
  isInputObjectType,
  isScalarType,
  isObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLArgument,
} from 'graphql';

function isCustomType(type: any) {
  return (
    type &&
    'name' in type &&
    !isScalarType(type) &&
    !type.name.startsWith('__') &&
    !['Query', 'Mutation'].includes(type?.name)
  );
}

export function isGraphqlInputObjectType(type: unknown): type is GraphQLInputObjectType {
  return isCustomType(type) && isInputObjectType(type);
}

export function isGraphqlObjectType(type: unknown): type is GraphQLObjectType {
  return isCustomType(type) && isObjectType(type);
}

export function getGraphqlInputTypes(type: readonly GraphQLArgument[]) {
  return type
    .map((type) => (type.type instanceof GraphQLNonNull ? type.type.ofType : type.type))
    .filter(isGraphqlInputObjectType);
}
