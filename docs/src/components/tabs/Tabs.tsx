import classNames from 'classnames';
import { isNil, reject } from 'ramda';
import React, { Children, useState } from 'react';
import TabPanel from './TabPanel';
import TabsHeader from './TabsHeader';

export interface CodeTabsProps {
  children: (JSX.Element | null)[] | JSX.Element | null;
  defaultIndex?: number;
}

/**
 * Tabs component.
 *
 * @example
 * <Tabs>
 *   ```html title=HTML
 *   <div id="tab-1"/>
 *   ```
 *   ```html title=Java
 *   <div id="tab-2"/>
 *   ```
 * </Tabs>
 */
export default function Tabs({ children: allChildren, defaultIndex = 0 }: CodeTabsProps) {
  const [focusedIndex, setFocusedIndex] = useState(defaultIndex);

  if (!allChildren) return null;

  const children = reject(isNil, Children.toArray(allChildren) as JSX.Element[]);

  // @ts-ignore
  const tabs = children?.map((component) => ({
    // Get code > pre props
    title: component?.props.children.props.title,
    code: component?.props.children.props.children,
  }));

  if (!children) return null;
  return (
    <div className="my-4">
      <TabsHeader tabs={tabs} currentTabIndex={focusedIndex}>
        {(tab, index) => (
          <button
            key={index}
            className={classNames(
              'py-2 px-3 text-xs font-bold font-mono text-white',
              focusedIndex === index
                ? 'text-opacity-100'
                : 'text-opacity-60 hover:text-opacity-100',
            )}
            onClick={() => setFocusedIndex(index)}
          >
            {tab.title}
          </button>
        )}
      </TabsHeader>
      {children.map((component, index) => (
        <TabPanel key={index} isActive={focusedIndex === index}>
          {component?.props.children}
        </TabPanel>
      ))}
    </div>
  );
}
