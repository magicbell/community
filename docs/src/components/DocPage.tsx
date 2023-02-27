import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import React, { ReactNode } from 'react';
import DocPageLayout from './layout/DocPageLayout';
import { defaultMagicBellTheme } from '@magicbell/magicbell-react';
import { OpenAPILink } from './menu/OpenAPILinks';

interface Props {
  title?: string;
  subtitle?: string;
  mdxSource?: MDXRemoteSerializeResult;
  children?: JSX.Element | JSX.Element[];
  editUrl?: string;
  openAPILinks?: OpenAPILink[];
}

const components: Record<string, ReactNode> = {
  a: ({ children, href }: { children: ReactNode; href: string }) => {
    const isMagicBell = /magicbell.com/i.test(href);
    const isProduct = /(app|api).magicbell.com/i.test(href);

    const rel = isProduct ? 'nofollow' : isMagicBell ? '' : 'noopener';
    return (
      <a href={href} rel={rel}>
        {children}
      </a>
    );
  },
};

export default function DocPage({
  title,
  subtitle,
  mdxSource,
  editUrl,
  children,
  openAPILinks,
}: Props) {
  const pageTitle = title || 'Docs';

  return (
    <DocPageLayout title={pageTitle} description={subtitle} openAPILinks={openAPILinks}>
      <h1 className="mt-16 mb-1 text-center">{title}</h1>
      <p className="mb-16 mt-8 font-normal text-center text-xl">{subtitle}</p>
      {mdxSource ? (
        <article className="mdx-content">
          <MDXRemote
            components={components}
            {...mdxSource}
            scope={{ defaultMagicBellTheme }}
          />
        </article>
      ) : (
        <p>Loading...</p>
      )}
      <section>{children}</section>

      {editUrl ? (
        <div className="mt-16">
          <a href={editUrl}>Edit this page</a>
        </div>
      ) : null}
    </DocPageLayout>
  );
}
