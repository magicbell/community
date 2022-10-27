/* eslint-disable @typescript-eslint/no-var-requires */
const CodeBuilder = require('httpsnippet/src/helpers/code-builder');

module.exports = function (source, options) {
  const opts = Object.assign(
    {
      pretty: true,
    },
    options,
  );

  // Start snippet
  const code = new CodeBuilder(opts.indent);

  // Import requests
  code.push('import requests').blank();

  // Set URL
  code.push('url = "%s"', source.url).blank();

  // Construct query string
  let qs;
  if (Object.keys(source.queryObj).length) {
    qs = 'querystring = ' + JSON.stringify(source.queryObj);

    code.push(qs).blank();
  }

  // Construct payload
  let hasPayload = false;
  let jsonPayload = false;
  switch (source.postData.mimeType) {
    case 'application/json':
      if (source.postData.jsonObj) {
        code
          .push('payload = %s', JSON.stringify(source.postData.jsonObj, null, 4))
          .blank();
        jsonPayload = true;
        hasPayload = true;
      }
      break;

    default: {
      const payload = JSON.stringify(source.postData.text);
      if (payload) {
        code.push('payload = %s', payload);
        hasPayload = true;
      }
    }
  }

  // Construct headers
  const headers = source.allHeaders;
  code.push('headers = %s', JSON.stringify(source.allHeaders, null, 4)).blank();
  const headerCount = Object.keys(headers).length;

  // Construct request
  const method = source.method;
  let request = `response = requests.${method.toLowerCase()}(url`;

  if (hasPayload) {
    if (jsonPayload) {
      request += ', json=payload';
    } else {
      request += ', data=payload';
    }
  }

  if (headerCount > 0) {
    request += ', headers=headers';
  }

  if (qs) {
    request += ', params=querystring';
  }

  request += ')';

  code.push(request);
  code.push('print(response.json())');

  return code.join();
};

module.exports.info = {
  key: 'requests-improved',
  title: 'Requests',
  link: 'http://docs.python-requests.org/en/latest/api/#requests.request',
  description: 'Requests HTTP library',
};
