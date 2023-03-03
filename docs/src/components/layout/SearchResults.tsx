import React from 'react';

interface Props {
  searchState?: any;
  searchResults?: any;
  children: JSX.Element | JSX.Element[];
}

export default function SearchResults({ searchState, searchResults, children }: Props) {
  if (!searchResults || !searchState) return null;
  return (
    <div className="absolute z-10 top-16 md:top-12 bg-app2 text-white rounded-md w-full shadow-xl">
      {searchResults.nbHits !== 0 ? (
        children
      ) : (
        <p className="m-0 py-4 px-8">
          No results have been found for {searchState.query}
        </p>
      )}
    </div>
  );
}
