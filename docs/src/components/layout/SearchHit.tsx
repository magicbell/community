import Link from 'next/link';
import React from 'react';

interface Props {
  hit: {
    objectID: string;
    title: string;
    content: string;
    slug: string;
    _highlightResult?: {
      title?: { value?: string };
      content?: { value?: string };
    };
    _snippetResult?: Record<string, unknown> | undefined;
    _distinctSeqID?: number | undefined;
  };
}

export default function SearchHit({ hit }: Props) {
  if (!hit) return null;

  const { _highlightResult, slug } = hit;
  const { title, content } = _highlightResult || {};

  if (!title && !content) return null;
  return (
    <Link href={slug} passHref>
      <article className="px-8 py-4 text-white hover:bg-gray-700 cursor-pointer">
        <p className="m-0" dangerouslySetInnerHTML={{ __html: title?.value || '' }} />
        <div
          className="m-0 text-gray-400 truncate text-sm"
          dangerouslySetInnerHTML={{ __html: content?.value || '' }}
        />
      </article>
    </Link>
  );
}
