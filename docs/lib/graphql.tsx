import { GraphQLField, GraphQLObjectType, isObjectType, isScalarType } from 'graphql';

export const headers = {
  'X-MAGICBELL-API-KEY': {
    name: 'X-MAGICBELL-API-KEY',
    required: true,
    in: '',
    description: 'API key of your MagicBell project.',
    schema: { type: 'String' },
  },
  'X-MAGICBELL-API-SECRET': {
    name: 'X-MAGICBELL-API-SECRET',
    required: true,
    in: '',
    description: 'API secret of your MagicBell project.',
    schema: { type: 'String' },
  },
  'X-MAGICBELL-USER-EXTERNAL-ID': {
    name: 'X-MAGICBELL-USER-EXTERNAL-ID',
    in: '',
    description:
      'ID of the user. Provide the X-MAGICBELL-USER-EMAIL header instead if you identify users by email.',
    schema: { type: 'String' },
  },
  'X-MAGICBELL-USER-EMAIL': {
    name: 'X-MAGICBELL-USER-EMAIL',
    in: '',
    description:
      'Email address of the user. Provide the X-MAGICBELL-USER-EXTERNAL-ID header instead if you identify users by ID.',
    schema: { type: 'String' },
  },
  'X-MAGICBELL-USER-HMAC': {
    name: 'X-MAGICBELL-USER-HMAC',
    in: '',
    description:
      'HMAC calculated with the API secret and ID, or email, of the user. Required if the project has HMAC enabled.',
    schema: { type: 'String' },
  },
};

export function buildQueryField(
  field: GraphQLField<any, any>,
): string | Record<string, any> {
  // @ts-ignore
  const { ofType } = field.type;
  let nestedFields = {} as Record<string, any>;

  if (ofType && !isScalarType(ofType) && typeof ofType.getFields === 'function') {
    nestedFields = ofType.getFields();
  } else if (isObjectType(field.type) && typeof field.type.getFields === 'function') {
    nestedFields = field.type.getFields();
  }

  if (nestedFields)
    return {
      [field.name]: Object.keys(nestedFields).map((key) =>
        buildQueryField(nestedFields[key]),
      ),
    };

  return field.name;
}

/**
 * Function to build fields for a GraphQL query from a GraphQLObject.
 *
 * @param node
 * @returns Array of fields to query
 */
export function buildQueryFields(node: GraphQLObjectType) {
  const fields = node?.getFields() || {};
  return Object.keys(fields).map((key) => buildQueryField(fields[key]));
}
