import { useRouter } from 'next/router';
import React from 'react';
import { SitemapItem } from '../../../lib/sitemap';
import GraphqlAPILinks from './GraphqlAPILinks';
import OpenAPILinks, { OpenAPILink } from './OpenAPILinks';
import PageLink from './PageLink';
import ParentMenuItem from './ParentMenuItem';

export default function MenuItem(props: SitemapItem & { openAPILinks?: OpenAPILink[] }) {
  const router = useRouter();

  if (props.hiddenRoute) return null;

  if (props.children) return <ParentMenuItem {...props} />;

  if (props.to === '/rest-api/reference' && router.asPath.startsWith('/rest-api')) {
    return (
      <>
        <PageLink {...props} />
        <OpenAPILinks links={props.openAPILinks} />
      </>
    );
  }

  if (props.to === '/graphql-api/reference' && router.asPath.startsWith('/graphql-api')) {
    return (
      <>
        <PageLink {...props} />
        <GraphqlAPILinks />
      </>
    );
  }

  if (props.to) {
    return <PageLink {...props} />;
  }

  return null;
}
