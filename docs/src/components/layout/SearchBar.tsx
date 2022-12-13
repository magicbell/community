import { useRouter } from 'next/router';
import { isEmpty } from 'ramda';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import useAlgolia from 'use-algolia';
import SearchBox from './SearchBox';
import SearchHits from './SearchHits';
import SearchResults from './SearchResults';

export default function SearchBar() {
  const router = useRouter();
  const ref = useRef(null);
  const [showResults, setShowResults] = useState(false);
  const closeResults = () => {
    setShowResults(false);
  };

  const [searchState, requestDispatch] = useAlgolia(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_INDEX ||
      `${process.env.NEXT_PUBLIC_VERCEL_ENV}_docs`,
  );

  useEffect(() => {
    closeResults();
  }, [router.asPath]);

  useClickAway(ref, closeResults);

  const search = async (query: string) => {
    if (isEmpty(query)) closeResults();
    else {
      setShowResults(true);
      requestDispatch({ query });
    }
  };

  return (
    <div ref={ref} className="relative">
      <SearchBox onSubmit={search} />
      {searchState && showResults ? (
        <SearchResults
          searchState={searchState.request}
          searchResults={searchState.response}
        >
          <SearchHits hits={searchState.hits} />
        </SearchResults>
      ) : null}
    </div>
  );
}
