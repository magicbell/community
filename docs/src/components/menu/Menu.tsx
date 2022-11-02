import React from 'react';
import { SitemapItem } from '../../../lib/sitemap';
import MenuItem from './MenuItem';
import { OpenAPILink } from './OpenAPILinks';

interface Props {
  navigationItems: SitemapItem[];
  openAPILinks?: OpenAPILink[];
}

/**
 * Menu component. The `navigationItems` might be undefined when the site is
 * prerendered.
 */
export default function Menu({ navigationItems = [], openAPILinks }: Props) {
  return (
    <div className="pb-4 overflow-y-auto">
      <nav>
        {navigationItems.map((item, index) => (
          <MenuItem key={index} {...item} openAPILinks={openAPILinks} />
        ))}
      </nav>
    </div>
  );
}
