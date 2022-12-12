import React from 'react';
import { SitemapItem } from '../../../lib/sitemap';
import MenuItem from './MenuItem';

export default function SectionMenuItem({ name, links = [] }: SitemapItem) {
  return (
    <div className="border-b border-borderMuted pb-4 pt-2 mb-4 last:border-0">
      {name ? (
        <h4 className="pb-2 pt-0 md:text-sm font-semibold text-textMuted">{name}</h4>
      ) : null}
      {links.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </div>
  );
}
