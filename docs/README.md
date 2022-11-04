This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Quick Start

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/magicbell-io/public)

## Getting Started

1. Install Node.js v14.17.4

2. Clone the repo

   ```bash
   git clone git@github.com:magicbell-io/public.git magicbell-docs
   ```

3. Navigate into the newly created directory

```bash
cd magicbell-docs
```

4. Install the dependencies

   ```bash
   yarn install
   ```

5. Start your development server:

   ```bash
   yarn dev
   ```

6. Open [http://localhost:3000/docs](http://localhost:3000/docs) with your browser to see the result.

The `docs` directory contains all entries for the site.

### Adding docs

Pages in the `docs` directory must be added to `sitemap.json` to be indexed for search and rendered. Doing so, by default, also adds items to the left sidebar navigation tree. This isn't always desirable, so you can hide items with `"hiddenRoute": true`:

```json
{
  "name": "indirect links not shown in the sidebar",
  "hiddenRoute": true,
  "children": [
    {
      "name": "some page",
      "to": "/page-1"
    },
    {
      "name": "another page",
      "to": "/page-2"
    }
  ]
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Heroku

Configure your Heroku CLI and run:

```
heroku git:remote -a magicbell-docs
git push heroku main
```
