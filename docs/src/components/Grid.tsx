import React from 'react';

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function Grid({ children }: Props) {
  return (
    <div className="masonry before:box-inherit after:box-inherit mb-12">{children}</div>
  );
}
