import fs from 'fs';
import * as matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import React from 'react';
import autolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import sitemap, { getAllSitemapItems } from '../lib/sitemap';
import DocPage from '../src/components/DocPage';

interface Props {
  metadata?: { [key: string]: any };
  mdxSource?: MDXRemoteSerializeResult;
  editUrl?: string;
}

export default function DynamicDocument({ mdxSource, metadata, editUrl }: Props) {
  if (!metadata) return null;
  return <DocPage mdxSource={mdxSource} editUrl={editUrl} {...metadata} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Load routes from the sitemap
  const allRoutes = getAllSitemapItems(sitemap)
    .filter((item) => item.to !== undefined && !item.staticRoute)
    .map((item) => item.to) as string[];

  return {
    paths: allRoutes.map((item) => {
      const path = item.startsWith('/') ? item.substr(1) : item;
      const slug = path.split('/');
      return { params: { slug } };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  Record<string, unknown>,
  { slug: string[] }
> = async ({ params }) => {
  // Read the file that contains the content for the route
  if (!params?.slug) {
    return { notFound: true };
  }
  const slug = params.slug.join('/');

  const filename = slug + '.mdx';
  const docsDirectory = path.join(process.cwd(), 'docs');
  const filePath = path.join(docsDirectory, filename);
  const editUrl = `https://github.com/magicbell-io/docs/edit/main/docs/${filename}`;

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // @ts-ignore
    const { content, data } = matter(fileContents);
    const mdxSource = await serialize(content, {
      mdxOptions: {
        rehypePlugins: [
          [rehypeSlug, {}],
          [autolinkHeadings, { behavior: 'wrap' }],
        ],
      },
    });

    return { props: { mdxSource, metadata: data, editUrl } };
  } catch (err) {
    return { notFound: true };
  }
};
