import React from 'react';

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
}

export default function Card({ children, title }: Props) {
  return (
    <div className="break-inside bg-lightPurple text-white rounded-md p-8 mb-4">
      <p className="font-bold text-2xl mb-6">{title}</p>
      {children}
    </div>
  );
}
