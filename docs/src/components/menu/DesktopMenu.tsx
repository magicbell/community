import React from 'react';
import { SitemapItem } from '../../../lib/sitemap';
import Menu from './Menu';
import { OpenAPILink } from './OpenAPILinks';

interface Props {
  navigationItems: SitemapItem[];
  openAPILinks?: OpenAPILink[];
}

export default function DesktopMenu({ navigationItems, openAPILinks }: Props) {
  return (
    <div className="sticky top-28 h-full bg-bgApp">
      <div
        className="flex-shrink-0 w-72 hidden md:block overflow-y-scroll"
        style={{ maxHeight: '85vh' }}
      >
        <Menu navigationItems={navigationItems} openAPILinks={openAPILinks} />
      </div>
    </div>
  );
}
