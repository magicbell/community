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
  let currentPagePath = '/';

  /* Get sections of the current page */
  // Check segments of current route to find the navigationItems
  currentPath.map((path, index) => {
    currentpageItems.map((section) => {
      section.links?.map((link) => {
        // Check all the pages for link of the route segment we are going over
        if (link.page && link.to?.split('/')[index + 1] === path) {
          // TODO : add a testcase for undefined subpage
          currentpageItems = link.subpage as SitemapItem[];
          currentPageName = link.name;
          currentPagePath = link.to;
        }
      });
    });
  });

  return (
    <div className="pb-4 overflow-y-auto px-6">
      <nav>
        {currentPageName ? (
          <PageHeadingMenu
            currentPageName={currentPageName}
            router={router}
            currentPagePath={currentPagePath}
          />
        ) : null}

        {currentpageItems.map((item, index) => (
          <MenuItem key={index} {...item} openAPILinks={openAPILinks} />
        ))}
      </nav>
    </div>
  );
}
