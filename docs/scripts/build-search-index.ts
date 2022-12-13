#!/usr/bin/env zx
import 'zx/globals';

import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';
import * as matter from 'gray-matter';
import { OpenAPIV3 } from 'openapi-types';
import path from 'path';
import { flatten, isNil, reject } from 'ramda';
import { remark } from 'remark';
import gfm from 'remark-gfm';
import html from 'remark-html';
// @ts-expect-error - This package doesn't have any types
import searchable from 'remark-mdx-searchable';
import slugify from 'slugify';
import { fetchOpenAPISpec } from '../lib/openapi';

/**
 * Read and parse the contents of an MDX file.
 * It parses the file with remark and extract the metadata with gray-matter.
 *
 * @param {string} filePath Path to the MDX file to read
 * @returns An object containing the metada and its content in plain text.
 */
function parseMDXFile(filePath: string) {
  const fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const { content, data } = matter.default(fileContents);
  const compiled = remark().use(html).use(searchable).use(gfm).processSync(content);

  return (
    compiled.data as unknown as Array<{
      heading: string;
      text: string;
      [key: string]: unknown;
    }>
  ).map((item) => ({
    content: item.text,
    data: { heading: item.heading, ...data },
  }));
}

type Path = { to: string; name: string; children?: Path[] };
/**
 * Function to extract the `to` attribute from an entry of the the sitemap.json
 * file recursively.
 *
 * @param {Object} element
 * @returns A list of the paths
 */
function extractPath(element: Path): Path | Path[] {
  if (element.to) return { to: element.to, name: element.name };
  return reject(isNil, flatten(element.children?.map(extractPath) || []));
}

function getPost(context: Path, directory: string) {
  const fileName = context.to === '/' ? 'index.mdx' : context.to + '.mdx';
  const postPath = path.join(directory, fileName);
  if (!fs.existsSync(postPath)) return null;

  const contents = parseMDXFile(postPath);

  // {
  //   slug: string;
  //   contents: [
  //     {
  //       content: string;
  //       data: {
  //         title: string;
  //         subtitle: string;
  //         heading: string;
  //       }
  //     }
  //   ]
  // }
  return { slug: context.to, contents };
}

function getPostsFromSitemap() {
  const sitemap = fs.readJSONSync(path.join(process.cwd(), 'sitemap.json')) as Path[];

  const posts = [];
  const docsDirectory = path.join(process.cwd(), 'docs');
  const sitemapPaths = flatten(sitemap.map((entry) => extractPath(entry)));

  for (const entryFilePath of sitemapPaths) {
    // Do not try to index external links
    if (!entryFilePath.to.startsWith('/')) continue;

    try {
      const post = getPost(entryFilePath, docsDirectory);
      if (!post) continue;
      posts.push(post);
    } catch (err) {
      console.debug(err);
    }
  }

  return posts;
}

function buildOperationData(operation: OpenAPIV3.OperationObject) {
  return {
    slug: `/rest-api/reference#${operation.operationId}`,
    contents: [
      {
        content: operation.description,
        data: {
          title: 'API Reference',
          heading: operation.summary,
        },
      },
    ],
  };
}

async function getPostsFromOpenAPI() {
  const posts = [];

  const schema = await fetchOpenAPISpec();

  for (const item of Object.keys(schema.paths)) {
    const operations = schema.paths[item as keyof typeof schema.paths] || {};
    for (const operationKey of Object.keys(operations)) {
      const operation = operations[operationKey as keyof typeof operations];
      if (!operation || typeof operation !== 'object') continue;
      const operationData = buildOperationData(operation as OpenAPIV3.OperationObject);

      posts.push(operationData);
    }
  }

  return posts;
}

/**
 * Function to generate the contents of all the posts based on the sitemap.json
 * file.
 *
 * @returns An array containing all the posts' content and metadata
 */
async function getAllPosts() {
  const docsPosts = getPostsFromSitemap();
  const openAPIPosts = await getPostsFromOpenAPI();

  return [...docsPosts, ...openAPIPosts];
}

function buildSearchObjects(
  posts: Array<{
    slug: string;
    contents: Array<{ content?: string; data: { title?: string; heading?: string } }>;
  }>,
) {
  return flatten(
    posts.map(({ slug, contents }) =>
      contents.map(({ content, data }, index) => ({
        objectID: slug + ':' + index,
        title: data.heading ? data.title + ' > ' + data.heading : data.title,
        breadcrumbs: [data.title, data.heading],
        slug: data.heading
          ? `${slug}#${slugify(data.heading, { lower: true, remove: /["?]/ })}`
          : slug,
        content,
      })),
    ),
  );
}

(async function () {
  dotenv.config();

  const client = algoliasearch(
    String(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID),
    String(process.env.ALGOLIA_ADMIN_API_KEY),
  );

  try {
    const posts = await getAllPosts();
    const searchObjects = buildSearchObjects(posts);

    console.log(
      String(process.env.ALGOLIA_ADMIN_API_KEY),
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX ||
        `${process.env.NEXT_PUBLIC_VERCEL_ENV}_docs`,
    );

    const index = client.initIndex(
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX ||
        `${process.env.NEXT_PUBLIC_VERCEL_ENV}_docs`,
    );
    const response = await index.saveObjects(searchObjects);
    console.log(`algolia: build and stored ${response.objectIDs.length} objects.`);
  } catch (error) {
    console.error(error);
  }
})();
