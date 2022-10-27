import { take } from 'ramda';
import React from 'react';
import { useToggle } from 'react-use';

interface Props {
  maxItems?: number;
  className?: string;
  children: JSX.Element[];
}

export default function CollapsedSection({ children, className, maxItems = 7 }: Props) {
  const [collapsed, toggleCollapsed] = useToggle(true);
  const childrenArray = React.Children.toArray(children);
  const truncate = childrenArray.length > maxItems && collapsed;

  return (
    <section className={className}>
      {truncate ? take(maxItems, childrenArray).map((child) => child) : childrenArray}
      {truncate && (
        <button
          className="block w-full p-2 bg-gray-100 text-darkPurple text-sm"
          onClick={toggleCollapsed}
        >
          Show all
        </button>
      )}
    </section>
  );
}
