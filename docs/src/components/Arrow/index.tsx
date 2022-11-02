import React from 'react';
import css from './Arrow.module.css';

export default function Arrow() {
  return (
    <div className={css.link}>
      <div className={css.arrowContainer}>
        <div className={css.arrowWrapper}>
          <svg
            className="absolute right-0 h-3.5"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            y="0"
            viewBox="0 0 18 14"
            xmlSpace="preserve"
          >
            <line className={`${css.line} ${css.middle}`} x1="17" y1="7" x2="1" y2="7" />
            <line className={css.line} x1="11" y1="1" x2="17" y2="7" />
            <line className={css.line} x1="11" y1="13" x2="17" y2="7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
