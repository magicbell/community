import { flatten, isNil, reject } from 'ramda';
import sitemap from '../sitemap.new.json';

export type SitemapItem = {
  name: string;
  to?: string;
  icon?: string;
  children?: SitemapItem[];
  section?: boolean;
  links?: SitemapItem[];
  subpage?: SitemapItem[];
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
    // TODO: add testcase for undefined links
    const links = element.links as SitemapItem[];
    return reject(isNil, flatten(links.map(getAllChildrenPaths)));
  }

  // TODO: add testcase for undefined children
  const children = element.children as SitemapItem[];
  return reject(isNil, flatten(children.map(getAllChildrenPaths)));
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

    if (item.section) {
      const links = item.links as SitemapItem[];
      links.forEach(traverse);
    }

    if (item.page) {
      const subpage = item.subpage as SitemapItem[];
      subpage.forEach(traverse);
    }
  };
  sitemap.forEach(traverse);
  return items;
}
