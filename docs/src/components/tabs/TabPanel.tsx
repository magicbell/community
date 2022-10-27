import React from 'react';

interface Props {
  children: JSX.Element;
  isActive: boolean;
}

export default function TabPanel({ children, isActive }: Props) {
  if (!isActive) return null;
  return <div>{children}</div>;
}
