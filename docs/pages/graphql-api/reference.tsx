import fs from 'fs';
import { buildSchema } from 'graphql';
import * as matter from 'gray-matter';
import { GetStaticProps } from 'next';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import path from 'path';
import React from 'react';
import autolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import DocPage from '../../src/components/DocPage';
import Schema from '../../src/components/graphql/Schema';

interface Props {
  metadata?: { [key: string]: any };
  mdxAuthenticationSource?: MDXRemoteSerializeResult;
  serializedSchema: string;
}

export default function reference({
  mdxAuthenticationSource,
  serializedSchema,
  metadata = {},
}: Props) {
  return (
    <DocPage mdxSource={mdxAuthenticationSource} {...metadata}>
      <div className="my-12">
        <Schema schema={buildSchema(serializedSchema)} />
      </div>
    </DocPage>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const docsDirectory = path.join(process.cwd(), 'docs');
  const filePath = path.join(docsDirectory, 'graphql-api/authentication.mdx');
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const schemaFilePath = path.join(docsDirectory, 'graphql-api/reference/schema.graphql');
  const schemaFileContents = fs.readFileSync(schemaFilePath, 'utf8');
  const serializedSchema = schemaFileContents;

  // @ts-ignore
  const { content, data } = matter(fileContents);
  const mdxAuthenticationSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        [rehypeSlug, {}],
        [autolinkHeadings, { behavior: 'wrap' }],
      ],
    },
  });
  return {
    props: {
      mdxAuthenticationSource,
      metadata: data,
      serializedSchema,
    },
  };
};
