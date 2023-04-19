// @ts-ignore
import { MDXProvider } from '@mdx-js/react';
import type { AppProps } from 'next/app';
import Callout from '../src/components/Callout';
import Card from '../src/components/Card';
import HighlightedCode from '../src/components/code/HighlightedCode';
import Grid from '../src/components/Grid';
import dynamic from 'next/dynamic';
import Table from '../src/components/Table';
import Tabs from '../src/components/tabs/Tabs';
import Snippets from '../src/components/tabs/Snippets';
import '../styles/globals.css';
import '../styles/material.css';
import 'botz/styles.css';
import { SupportWidget } from '@magicbell/support-widget';
import PropsTable from '../src/components/PropsTable';

// Fonts
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/catamaran/500.css';
import '@fontsource/catamaran/600.css';

const NotificationInboxPreview = dynamic(
  import('../src/components/magicbell/NotificationInboxPreview'),
);

const components = {
  code: HighlightedCode,
  table: Table,
  Note: Callout,
  Grid,
  Card,
  Tabs,
  Snippets,
  HighlightedCode,
  NotificationInboxPreview,
  PropsTable,
};

function MyApp({
  Component,
  pageProps,
}: Omit<AppProps, 'Component'> & { Component: any }) {
  // cheap way to redirect that's less anoying than the 404. Vercel doesn't like the redirect
  // from / to /docs via next.config.js#redirects
  if (typeof window !== 'undefined') {
    if (window.location.pathname === '/') {
      window.location.pathname = '/docs/';
      return null;
    }
  }

  return (
    <>
      <MDXProvider components={components}>
        <Component {...pageProps} />
      </MDXProvider>
      <SupportWidget />
    </>
  );
}

export default MyApp;
