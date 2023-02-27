import classNames from 'classnames';
import React from 'react';

interface Props {
  children: JSX.Element | JSX.Element[];
  className: string;
}

export default function Callout({ children, className }: Props) {
  return (
    <div className="rounded bg-gradient-to-b from-yellowOutlineStart to-yellowOutlineEnd p-[1px] my-4 relative">
      <div
        className={classNames(
          'p-4 rounded g-app bg-app bg-gradient-to-b from-darkGradientStart to-darkGradientEnd text-yellow relative bottom-[0.5px] [&>a]:underline [&>a]:text-yellow [&>a:hover]:text-lightYellow [&>a:hover]:underline',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
