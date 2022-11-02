import {
  BookOpenIcon,
  HomeIcon,
  InformationCircleIcon,
  LibraryIcon,
  NewspaperIcon,
  SupportIcon,
  TerminalIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import React from 'react';

interface Props {
  name: string;
  isActive?: boolean;
}

export default function LinkIcon({ name, isActive = false }: Props) {
  let Component = null;
  if (name === 'home') Component = HomeIcon;
  if (name === 'info') Component = InformationCircleIcon;
  if (name === 'terminal') Component = TerminalIcon;
  if (name === 'library') Component = LibraryIcon;
  if (name === 'book-open') Component = BookOpenIcon;
  if (name === 'support') Component = SupportIcon;
  if (name === 'newspaper') Component = NewspaperIcon;

  if (Component === null) return null;
  return (
    <Component
      className={classNames(
        isActive ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-800',
        'mr-3 flex-shrink-0 h-6 w-6',
      )}
      aria-hidden="true"
    ></Component>
  );
}
