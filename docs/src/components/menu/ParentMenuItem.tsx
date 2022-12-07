import ChevronRightIcon from '@heroicons/react/outline/ChevronRightIcon';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { includes } from 'ramda';
import React from 'react';
import { useToggle } from 'react-use';
import { getAllChildrenPaths, SitemapItem } from '../../../lib/sitemap';
import MenuItem from './MenuItem';

export default function ParentMenuItem({ name, children = [], ...props }: SitemapItem) {
  const router = useRouter();
  const allChildrenPaths = getAllChildrenPaths({ children: children });
  const defaulIsOpen = includes(router.asPath, allChildrenPaths);
  const [isOpen, toggle] = useToggle(defaulIsOpen);

  return (
    <div className="submenu" aria-expanded={isOpen}>
      <button
        className="group py-3 flex items-center w-full hover:bg-bgHover group-hover:text-textLinkHover"
        onClick={toggle}
      >
        <a className="flex-1 md:text-sm text-left text-textDefault">{name}</a>
        <ChevronRightIcon
          className={classNames(isOpen ? 'rotate-90' : 'rotate-0', 'transform h-4 w-4')}
        />
      </button>
      <ul
        className={classNames(
          'border-l border-gray-200 border-dashed ml-9',
          isOpen ? '' : 'hidden',
        )}
      >
        {children.map((item, index) => (
          <MenuItem key={index} {...props} {...item} />
        ))}
      </ul>
    </div>
  );
}
