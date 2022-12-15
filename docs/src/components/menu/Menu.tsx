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

function splitPath(path: string): string[] {
  const slicedPath = path.startsWith('/') ? path.substring(1) : path;
  return slicedPath.split('/');
}

/**
 * Menu component. The `navigationItems` might be undefined when the site is
 * prerendered.
 */
export default function Menu({ navigationItems = [], openAPILinks }: Props) {
  const router = useRouter();
  const currentPath: string[] = splitPath(router.asPath);
  let currentSubpages = navigationItems;
  let currentPageName: string | undefined; // undefined for /docs
  let currentPagePath = '/';

  // Find and get the current page item
  currentPath.forEach((pathSegment, pathDepthIndex) => {
    currentSubpages.forEach((section) => {
      if (!section.links) return;

      const currentPageItem = section.links.find(
        (link) =>
          link.page && splitPath(link.to as string)[pathDepthIndex] === pathSegment,
      );

      if (currentPageItem === undefined) return;
      currentSubpages = currentPageItem.subpage as SitemapItem[];
      currentPageName = currentPageItem.name;
      currentPagePath = currentPageItem.to || '/';
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

        {currentSubpages.map((item, index) => (
          <MenuItem key={index} {...item} openAPILinks={openAPILinks} />
        ))}
      </nav>
    </div>
  );
}
