import React from 'react';
import HighlightedCode from '../code/HighlightedCode';
import Tabs from './Tabs';
import { stringify } from 'javascript-stringify';

export default function Snippets({ params }: { params: Record<string, unknown> }) {
  return (
    <Tabs>
      <div>
        <HighlightedCode className="json" title="PAYLOAD" hideHeader noTopBorderRadius>
          {JSON.stringify(params, null, 2)}
        </HighlightedCode>
      </div>

      <div>
        <HighlightedCode
          className="language-curl"
          title="cURL"
          hideHeader
          noTopBorderRadius
        >
          {curl(params)}
        </HighlightedCode>
      </div>

      <div>
        <HighlightedCode
          className="language-ruby"
          title="RUBY"
          hideHeader
          noTopBorderRadius
        >
          {ruby(params)}
        </HighlightedCode>
      </div>

      <div>
        <HighlightedCode
          className="language-python"
          title="PYTHON"
          hideHeader
          noTopBorderRadius
        >
          {python(params)}
        </HighlightedCode>
      </div>

      <div>
        <HighlightedCode
          className="language-javascript"
          title="JAVASCRIPT"
          hideHeader
          noTopBorderRadius
        >
          {javascript(params)}
        </HighlightedCode>
      </div>
    </Tabs>
  );
}

const curl = (params: Record<string, unknown>) =>
  `curl https://api.magicbell.com/notifications \\
  --request POST \\
  --header 'X-MAGICBELL-API-KEY: MAGICBELL_API_KEY' \\
  --header 'X-MAGICBELL-API-SECRET: MAGICBELL_API_SECRET' \\
  --data '${JSON.stringify(params, null, 2)
    .split('\n')
    .map((line, i) => (i === 0 ? line : '  ' + line))
    .join('\n')}'`;

const ruby = (params: Record<string, unknown>) =>
  `require 'httparty'

headers = {
  "X-MAGICBELL-API-KEY": "MAGICBELL_API_KEY",
  "X-MAGICBELL-API-SECRET": "MAGICBELL_API_SECRET",
}

body = ${stringify(params, null, 2)}

response = HTTParty.post("https://api.magicbell.com", { body: body.to_json, headers: headers })`;

const python = (params: Record<string, unknown>) =>
  `import requests

headers = {
  'X-MAGICBELL-API-SECRET': 'MAGICBELL_API_KEY',
  'X-MAGICBELL-API-KEY': 'MAGICBELL_API_SECRET',
}

data = ${JSON.stringify(params, null, 2)}

response = requests.post('https://api.magicbell.com/notifications', headers=headers, json=data)`;

const javascript = (params: Record<string, unknown>) =>
  `import axios from 'axios';

const headers = {
  'X-MAGICBELL-API-SECRET': 'MAGICBELL_API_KEY',
  'X-MAGICBELL-API-KEY': 'MAGICBELL_API_SECRET',
};

const data = ${stringify(params, null, 2)}

axios.post('https://api.magicbell.com/notifications', data, { headers });`;
