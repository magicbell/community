import Link from 'next/link';
import React from 'react';

interface Props {
  link: {
    ariaLabel?: string;
    displayText: string;
    url: string;
  };
}

export default function FooterLink({ link }: Props) {
  if (!link) return null;
  return (
    <li>
      <Link href={link.url}>
        <a aria-label={link.ariaLabel || link.displayText} rel="noreferrer">
          {link.displayText}
        </a>
      </Link>
    </li>
  );
}
