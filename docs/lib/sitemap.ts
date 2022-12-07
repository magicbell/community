import { flatten, isNil, reject } from 'ramda';
// TODO: correct the import
import sitemap from '../sitemap.new.json';
/* import sitemap from '../sitemap.json'; */

export type SitemapItem = {
  name: string;
  to?: string;
  icon?: string;
  children?: SitemapItem[];
  section?: boolean;
  links?: SitemapItem[];
  /**
   * A page is used to determine the subpages (e.g. ‘Channels’) which updates the default
   * state of the nav/sidebar to display the links in the subpage (children of the page).
   */
  page?: boolean;

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

export function getAllChildrenPaths(element: Partial<SitemapItem>): string[] | string {
  if (element.to) return element.to;

  if (element.section) {
    if (!element.links) {
      throw new Error(
        'Section with no links found, please ensure the correctness of the sitemap.',
      );
    }

    return reject(isNil, flatten(element.links.map(getAllChildrenPaths)));
  }

  if (element.children === undefined) {
    // If the element is not a `section` and not a `to` it should always contain children
    throw new Error(
      'Failed to get the children of the element, please ensure the correctness of the sitemap.',
    );
  }

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
