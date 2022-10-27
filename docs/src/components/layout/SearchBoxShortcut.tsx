import hotkeys from 'hotkeys-js';
import React, { useEffect } from 'react';

export default function SearchBoxShortcut() {
  useEffect(() => {
    hotkeys('ctrl+k, command+K', function (event) {
      event.preventDefault();
      document.getElementById('search-field')?.focus();
      return false;
    });

    return () => {
      hotkeys.unbind('ctrl+k, command+K');
    };
  }, []);

  return (
    <div>
      <span className="hidden sm:flex items-center text-gray-400 text-sm leading-5 p-2 border border-gray-300 rounded-md">
        <span className="sr-only">Press </span>
        <kbd className="font-sans">
          <span title="Command">⌘</span>
        </kbd>
        <span className="sr-only"> and </span>
        <kbd className="font-sans ml-1">K</kbd>
        <span className="sr-only"> to search</span>
      </span>
    </div>
  );
}
