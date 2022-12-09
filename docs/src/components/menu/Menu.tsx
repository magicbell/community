import { useRouter } from 'next/router';
import React from 'react';
import { SitemapItem } from '../../../lib/sitemap';
import MenuItem from './MenuItem';
import { OpenAPILink } from './OpenAPILinks';
import PageHeadingMenu from './PageHeadingMenu';

interface Props {
  navigationItems: SitemapItem[];
  openAPILinks?: OpenAPILink[];
}

/**
 * Menu component. The `navigationItems` might be undefined when the site is
 * prerendered.
 */
export default function Menu({ navigationItems = [], openAPILinks }: Props) {
  const router = useRouter();
  const currentPath: string[] = router.asPath.split('/').slice(1);
  let currentPageName: string | undefined;
  let currentpageItems = navigationItems;

  // TODO : handle for arbitrary nesting of pages
  // Get sections of the current page
  navigationItems.map((section) => {
    section.links?.map((link) => {
      if (link.page && link.to?.slice(1) === currentPath[0]) {
        // TODO : add a testcase for undefined subpage
        currentpageItems = link.subpage as SitemapItem[];
        currentPageName = link.name;
      }
    });
  });

  return (
    <div className="pb-4 overflow-y-auto px-6">
      <nav>
        {currentPageName ? (
          <PageHeadingMenu currentPageName={currentPageName} router={router} />
        ) : null}

        {currentpageItems.map((item, index) => (
          <MenuItem key={index} {...item} openAPILinks={openAPILinks} />
        ))}
      </nav>
    </div>
  );
}
