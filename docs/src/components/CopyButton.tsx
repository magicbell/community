import CheckIcon from '@heroicons/react/outline/CheckIcon';
import ClipboardIcon from '@heroicons/react/outline/ClipboardIcon';
import React from 'react';
import { useCopyToClipboard, useToggle } from 'react-use';

export default function CopyButton({ text }: { text: string }) {
  const [copied, toggleCopied] = useToggle(false);
  const [_, copyToClipboard] = useCopyToClipboard();

  const handleClick = () => {
    copyToClipboard(text);
    toggleCopied();
    setTimeout(toggleCopied, 1000);
  };

  return (
    <button type="button" onClick={handleClick} aria-label={copied ? 'copied' : 'copy'}>
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-400" />
      ) : (
        <ClipboardIcon className="h-4 w-4" />
      )}
    </button>
  );
}
