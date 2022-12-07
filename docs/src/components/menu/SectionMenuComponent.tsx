import React from 'react';
import { SitemapItem } from '../../../lib/sitemap';
import MenuItem from './MenuItem';

export default function ParentMenuItem({ name, links = [] }: SitemapItem) {
  return (
    <div className="border-b border-borderMuted pb-4">
      <h4 className="pb-2 pt-6 md:text-sm font-semibold text-textMuted">{name}</h4>
      {links.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </div>
  );
}
