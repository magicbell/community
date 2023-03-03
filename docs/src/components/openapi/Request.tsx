import classNames from 'classnames';
import { OpenAPIV3 } from 'openapi-types';
import { reject } from 'ramda';
import React from 'react';
import { buildRequestSnippet } from '../../../lib/codeSnippet';
import HighlightedCode from '../code/HighlightedCode';
import Tabs from '../tabs/Tabs';

interface Props {
  location?: string;
  method?: string;
  operation?: OpenAPIV3.OperationObject;
}

export default function Request({ method, location, operation }: Props) {
  if (!method || !location || !operation) return null;

  // @ts-ignore
  const {
    requestBody,
    parameters = [],
  }: {
    requestBody: OpenAPIV3.RequestBodyObject;
    parameters: OpenAPIV3.ParameterObject[];
  } = operation;

  const example = requestBody?.content?.['application/json'].example;
  const headerParams = reject(
    (param: OpenAPIV3.ParameterObject) => param.in !== 'header' || !param.required,
    parameters as OpenAPIV3.ParameterObject[],
  );

  const snippet = buildRequestSnippet(
    location,
    method,
    headerParams,
    example
      ? {
          mimeType: 'application/json',
          text: JSON.stringify(example),
        }
      : null,
  );

  return (
    <div>
      <p className="font-mono text-sm">
        <span
          className={classNames(
            'py-1 px-2 text-white text-xs uppercase rounded-sm',
            method === 'POST' && 'bg-emerald-500 text-green-50',
            method === 'GET' && 'bg-blue-500 text-blue-50',
            method === 'PUT' && 'bg-violet-500 text-violet-50',
            method === 'DELETE' && 'bg-red-500 text-red-50',
          )}
        >
          {method}
        </span>{' '}
        {location}
      </p>
      <Tabs>
        {example ? (
          <div>
            <HighlightedCode
              className="json"
              title="PAYLOAD"
              hideHeader
              noTopBorderRadius
            >
              {JSON.stringify(example, null, 2)}
            </HighlightedCode>
          </div>
        ) : null}
        <div>
          <HighlightedCode
            className="language-curl"
            title="cURL"
            hideHeader
            noTopBorderRadius
          >
            {snippet.convert('shell', 'curl')}
          </HighlightedCode>
        </div>
        <div>
          <HighlightedCode
            className="language-node"
            title="NODE"
            hideHeader
            noTopBorderRadius
          >
            {snippet.convert('node')}
          </HighlightedCode>
        </div>
        <div>
          <HighlightedCode
            className="language-python"
            title="PYTHON"
            hideHeader
            noTopBorderRadius
          >
            {snippet.convert('python', 'requests-improved')}
          </HighlightedCode>
        </div>
        <div>
          <HighlightedCode
            className="language-ruby"
            title="RUBY"
            hideHeader
            noTopBorderRadius
          >
            {snippet.convert('ruby', 'httparty')}
          </HighlightedCode>
        </div>
        <div>
          <HighlightedCode
            className="language-java"
            title="JAVA"
            hideHeader
            noTopBorderRadius
          >
            {snippet.convert('java', 'okhttp')}
          </HighlightedCode>
        </div>
        <div>
          <HighlightedCode
            className="language-go"
            title="GO"
            hideHeader
            noTopBorderRadius
          >
            {snippet.convert('go')}
          </HighlightedCode>
        </div>
        <div>
          <HighlightedCode
            className="language-swift"
            title="SWIFT"
            hideHeader
            noTopBorderRadius
          >
            {snippet.convert('swift')}
          </HighlightedCode>
        </div>
      </Tabs>
    </div>
  );
}
