import { flatten, isNil, reject } from 'ramda';
import sitemap from '../sitemap.json';

export type SitemapItem = {
  name: string;
  to?: string;
  icon?: string;
  children?: SitemapItem[];
  /**
   * Static Routes are routes that have a dedicated page file, or point to an external url.
   * These routes are not "dynamic" next pages, like [...slug].tsx
   */
  staticRoute?: boolean;

  /**
   * Hidden routes are urls that need to get indexed, but won't be added to the nav/sidebar
   */
  hiddenRoute?: boolean;
};

export default sitemap as SitemapItem[];

export function getAllChildrenPaths(element: any): string[] {
  if (element.to) return element.to;
  return reject(isNil, flatten(element.children.map(getAllChildrenPaths)));
}

/**
 * Helper function to flatten the sitemap
 * @param sitemap the sitemap to flatten
 * @returns an array of elements of the sitemap
 */
export function getAllSitemapItems(sitemap: SitemapItem[]): SitemapItem[] {
  const items: SitemapItem[] = [];
  const traverse = (item: SitemapItem) => {
    items.push(item);
    if (item.children) {
      item.children.forEach(traverse);
    }
  };
  sitemap.forEach(traverse);
  return items;
}
