import React from 'react';
import CopyButton from '../CopyButton';

interface Props {
  title: string | JSX.Element;
  code: string;
}

export default function HighlightedCodeHeader({ title, code }: Props) {
  return (
    <div
      className="pl-6 px-3 rounded-t-md uppercase text-xs font-bold text-white flex items-center h-10"
      style={{
        background: '#140939',
      }}
    >
      <div className="flex-1">{title}</div>
      <div className="border-l border-white/25 py-0.5 pl-2">
        <CopyButton text={code} />
      </div>
    </div>
  );
}
