import Document, { Head, Html, Main, NextScript } from 'next/document';
import SegmentScripts from '../src/components/scripts/SegmentScripts';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="copyright" content="MagicBell, Inc." />
          <meta property="og:type" content="website" />
          <meta name="apple-mobile-web-app-title" content="MagicBell" />
          <meta name="application-name" content="MagicBell" />
          <meta name="msapplication-TileColor" content="#5225c1" />
          <meta name="theme-color" content="#ffffff" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/docs/apple-touch-icon.png"
          />
          <link rel="mask-icon" href="/docs/safari-pinned-tab.svg" color="#5225c1" />
          <link rel="shortcut icon" href="/docs/favicon.ico" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/docs/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/docs/favicon-16x16.png"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <SegmentScripts />
        </body>
      </Html>
    );
  }
}
