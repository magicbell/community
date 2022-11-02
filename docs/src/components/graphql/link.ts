import { isGraphqlInputObjectType, isGraphqlObjectType } from './lib';
import slugify from 'slugify';

function getSlug(str: string): string {
  return slugify(str.replace(/[A-Z]/g, '-$&'), { lower: true, remove: /"\|\?/g });
}

export function getLink(type: unknown) {
  if (typeof type === 'string') {
    return getSlug(type);
  }

  if (isGraphqlInputObjectType(type)) {
    return getSlug(type.name);
  }

  if (isGraphqlObjectType(type)) {
    return getSlug(type.name);
  }

  throw new Error(`Unsupported type: ${type}`);
}
