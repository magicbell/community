/* eslint-disable @next/next/no-img-element */
import MenuIcon from '@heroicons/react/outline/MenuIcon';
import React from 'react';
import MagicBellLogo from '../../../public/magicbell.svg';
import Arrow from '../Arrow';

interface Props {
  onToggleMenu: () => void;
}

export default function Header({ onToggleMenu }: Props) {
  const toggleMenu = () => {
    onToggleMenu();
  };

  return (
    <header className="z-20 shrink-0 flex sticky top-0 border-b border-outlineDark bg-app h-24">
      <div className="flex-1 hidden justify-between md:flex max-w-screen-xl mx-auto md:px-8 p-4">
        <div className="flex-1 flex items-center space-x-10 py-4">
          <div className="flex-1 flex space-x-24">
            <a href="https://www.magicbell.com" aria-label="Go to homepage">
              <MagicBellLogo
                className="md:h-7 h-6 fill-current text-default"
                role="img"
                aria-label="MagicBell logo"
                focusable="false"
              />
            </a>
            <div className="flex-1 space-x-6">
              <a
                href="https://www.magicbell.com/spec"
                className="text-default hover:text-hover"
              >
                Notification Spec
              </a>
              <a
                href="https://www.magicbell.com/docs"
                className="text-link hover:text-hover"
              >
                Docs
              </a>
              <a
                href="https://www.magicbell.com/pricing"
                className="text-default hover:text-hover"
              >
                Pricing
              </a>
              <a
                href="https://www.magicbell.com/careers"
                className="text-default hover:text-hover"
              >
                Careers
              </a>
            </div>
          </div>
          <a
            className="font-bold text-2xl hover:text-hover text-default"
            href="https://app.magicbell.com"
            rel="nofollow"
          >
            <div className="flex items-center space-x-4">
              <span>Sign up</span>
              <Arrow />
            </div>
          </a>
        </div>
      </div>
      <div className="flex-1 flex items-center md:hidden px-4 py-6">
        <a href="https://www.magicbell.com">
          <MagicBellLogo
            className="h-7 fill-current text-default"
            role="img"
            aria-label="MagicBell logo"
            focusable="false"
          />
        </a>
      </div>
      <button
        className="p-4 focus:outline-none md:hidden text-default"
        onClick={toggleMenu}
      >
        <span className="sr-only">Open main menu</span>
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>
    </header>
  );
}
