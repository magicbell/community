import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { ExternalLinkIcon } from '@heroicons/react/outline';

interface Props {
  name: string | JSX.Element;
  to?: string | undefined;
  staticRoute?: boolean | undefined;
  style?: React.CSSProperties;
}

export default function PageLink({ name, to, style }: Props) {
  const router = useRouter();
  const isActive = router.asPath === to;
  const isInternalLink = !to || to.startsWith('/');
  const aProps = isInternalLink
    ? {}
    : {
        target: '_blank',
        rel: 'noopener noreferrer',
      };

  return (
    <Link href={to || ''}>
      <a
        className={classNames(
          isActive
            ? 'bg-bgApp text-textLinkHover hover:bg-bgHover'
            : 'text-textDefault hover:bg-bgHover group-hover:text-textLinkHover',
          'group py-2 flex items-center md:text-sm justify-between',
        )}
        style={style}
        {...aProps}
      >
        <span>{name}</span>
        {isInternalLink ? null : <ExternalLinkIcon className="h-4 w-4" />}
      </a>
    </Link>
  );
}
