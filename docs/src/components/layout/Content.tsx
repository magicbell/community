import React, { ReactNode } from 'react';
import SearchBar from './SearchBar';

interface Props {
  children: ReactNode;
}

export default function Content({ children }: Props) {
  return (
    <div className="flex-1 pb-24 overflow-x-hidden w-full md:px-8">
      <div className="flex flex-col">
        <div className="md:mt-4 md:py-4 px-4 md:px-0 border-b border-gray-200">
          <SearchBar />
        </div>
        <main className="flex-1 relative overflow-y-auto focus:outline-none px-4 md:px-0">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
