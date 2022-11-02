import { SearchResponse } from '@algolia/client-search';
import React from 'react';
import SearchHit from './SearchHit';

interface Props {
  hits: SearchResponse['hits'];
}

export default function SearchHits({ hits = [] }: Props) {
  return (
    <ul className="max-h-96 overflow-y-scroll divide-y divide-gray-700 rounded-md">
      {hits.map((hit, index) => (
        <li key={index}>
          {/* @ts-ignore */}
          <SearchHit hit={hit} />
        </li>
      ))}
    </ul>
  );
}
