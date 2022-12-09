import fs from 'fs';
import * as matter from 'gray-matter';
import { GetStaticProps } from 'next';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import React from 'react';
import autolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import DocPage from '../src/components/DocPage';

interface Props {
  metadata?: { [key: string]: any };
  mdxSource?: MDXRemoteSerializeResult;
}

export default function index({ mdxSource, metadata = {} }: Props) {
  return <DocPage mdxSource={mdxSource} {...metadata}></DocPage>;
}

export const getStaticProps: GetStaticProps = async () => {
  const docsDirectory = path.join(process.cwd(), 'docs-new');
  const filePath = path.join(docsDirectory, 'index.mdx');
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
  return { props: { mdxSource, metadata: data } };
};
