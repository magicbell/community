import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

interface Props {
  title: string;
  timestamp: string | number | Date;
  children: JSX.Element | JSX.Element[] | string;
  isHighlighted?: boolean;
}

export default function ChangelogEntry({
  title,
  timestamp,
  children,
  isHighlighted = false,
}: Props) {
  const date = dayjs(timestamp);
  return (
    <li>
      <article>
        <a
          className={classNames(
            isHighlighted
              ? 'grid md:grid-cols-8 xl:grid-cols-9 items-start relative rounded-xl p-3 sm:p-5 xl:p-6 overflow-hidden hover:bg-white text-gray-600'
              : 'grid md:grid-cols-8 xl:grid-cols-9 items-start relative rounded-xl p-3 sm:p-5 xl:p-6 overflow-hidden hover:bg-white text-gray-600',
          )}
        >
          <h3 className="font-semibold text-gray-900 md:col-start-3 md:col-span-6 xl:col-start-3 xl:col-span-7 mb-1 ml-9 md:ml-0">
            {title}
          </h3>
          <time
            dateTime={date.toISOString()}
            className={classNames(
              isHighlighted
                ? 'md:col-start-1 md:col-span-2 row-start-1 md:row-end-3 flex items-center font-medium mb-1 md:mb-0'
                : 'md:col-start-1 md:col-span-2 row-start-1 md:row-end-3 flex items-center font-medium mb-1 md:mb-0',
            )}
          >
            <svg
              viewBox="0 0 12 12"
              className={classNames(
                'w-3 h-3 mr-6 overflow-visible',
                isHighlighted ? 'text-violet-600' : 'text-gray-300',
              )}
            >
              <circle cx="6" cy="6" r="6" fill="currentColor"></circle>
              {isHighlighted ? (
                <circle
                  cx="6"
                  cy="6"
                  r="11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                ></circle>
              ) : (
                <path
                  d="M 6 -6 V -30"
                  fill="none"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="text-gray-200"
                ></path>
              )}

              <path
                d="M 6 18 V 500"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                className="text-gray-200"
              ></path>
            </svg>
            {date.format('MMM D, YYYY')}
          </time>
          <main className="md:col-start-3 md:col-span-6 xl:col-span-7 ml-9 md:ml-0 text-gray-600">
            {children}
          </main>
        </a>
      </article>
    </li>
  );
}
