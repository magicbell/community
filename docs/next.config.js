/* eslint-disable @typescript-eslint/no-var-requires */
const redirects = require('./redirects.json');
const withSvgr = require('next-svgr');

module.exports = withSvgr({
  reactStrictMode: true,
  basePath: '/docs',
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.mdx?/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: 'raw-loader',
          options: {},
        },
      ],
    });

    return config;
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  async redirects() {
    return redirects;
  },
});
