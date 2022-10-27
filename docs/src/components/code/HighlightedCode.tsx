import classNames from 'classnames';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import clojure from 'highlight.js/lib/languages/clojure';
import diff from 'highlight.js/lib/languages/diff';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
// @ts-ignore
import curl from 'highlightjs-curl';
import React from 'react';
import graphql from '../../../lib/highlight-graphql';
import HighlightedCodeHeader from './HighlightedCodeHeader';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('clojure', clojure);
hljs.registerLanguage('curl', curl);
hljs.registerLanguage('diff-html', diff);
hljs.registerLanguage('graphql', graphql);
hljs.registerLanguage('go', go);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('node', javascript);
hljs.registerLanguage('php', php);
hljs.registerLanguage('python', python);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

export interface HighlightedCodeProps {
  children: string;
  title?: string | JSX.Element;
  className?: string;
  hideHeader?: boolean;
  noTopBorderRadius?: boolean;
}

/**
 * Component to render code highlighted with highlight.js.
 *
 * @example
 */
export default function HighlightedCode({
  children: code,
  title,
  className,
  hideHeader = false,
  noTopBorderRadius = false,
}: HighlightedCodeProps) {
  if (!code) return null;

  const language = className?.replace('language-', '') || 'bash';
  function parseCode(str: string) {
    return hljs.highlight(str, { language }).value;
  }

  return (
    <code className={classNames('block mb-4', className)}>
      {!hideHeader ? (
        <HighlightedCodeHeader title={title || language} code={code} />
      ) : null}
      <pre
        style={{ background: '#190b47' }}
        className={classNames(
          'hljs font-mono p-6 text-white overflow-x-auto',
          !hideHeader || noTopBorderRadius ? 'rounded-b-md' : 'rounded-md',
        )}
        dangerouslySetInnerHTML={{ __html: parseCode(code) }}
      />
    </code>
  );
}
