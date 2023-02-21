import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect } from 'react';
import { useToggle } from 'react-use';
import sitemap from '../../../lib/sitemap';
import DesktopMenu from '../menu/DesktopMenu';
import MobileMenu from '../menu/MobileMenu';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import { OpenAPILink } from '../menu/OpenAPILinks';

interface Props {
  title?: string;
  description?: string;
  children: ReactNode;
  openAPILinks?: OpenAPILink[];
}

export default function DocPageLayout({
  title = 'Docs',
  description,
  children,
  openAPILinks,
}: Props) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useToggle(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.asPath]); // eslint-disable-line react-hooks/exhaustive-deps

  const path = [router.basePath, router.asPath].filter(Boolean).join('');
  const baseURL = process.env.NEXT_STATIC_BASE_URL || 'https://www.magicbell.com';
  const canonical = new URL(path, baseURL).toString();

  return (
    <div className="min-h-screen flex flex-col">
      <NextSeo
        title={`MagicBell - ${title}`}
        description={description}
        canonical={canonical}
      />
      <Header onToggleMenu={toggleSidebar} />
      <div className="max-w-screen-xl mx-auto divide-x divide-outlineDark flex flex-1 w-full">
        <MobileMenu
          navigationItems={sitemap}
          isOpen={sidebarOpen}
          toggle={toggleSidebar}
          openAPILinks={openAPILinks}
        />
        <DesktopMenu navigationItems={sitemap} openAPILinks={openAPILinks} />
        <Content>{children}</Content>
      </div>
      <Footer />
    </div>
  );
}
