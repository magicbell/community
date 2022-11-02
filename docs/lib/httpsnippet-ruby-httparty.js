/* eslint-disable @typescript-eslint/no-var-requires */
const CodeBuilder = require('httpsnippet/src/helpers/code-builder');

module.exports = function (source) {
  const code = new CodeBuilder();

  code.push("require 'httparty'");

  code.blank();

  // To support custom methods we check for the supported methods
  // and if doesn't exist then we build a custom class for it
  const method = source.method.toUpperCase();
  const capMethod = method.charAt(0) + method.substring(1).toLowerCase();

  code.push('url = "%s"', source.fullUrl);

  // Headers
  code.blank();
  code.push('headers = %s', JSON.stringify(source.allHeaders, null, 2));

  // Body
  code.blank();
  if (source.postData.text) {
    code.push('payload = %s', JSON.stringify(JSON.parse(source.postData.text), null, 2));
    code.blank();

    code.push(
      'response = HTTParty.%s(url, headers: headers, body: payload.to_json)',
      capMethod.toLowerCase(),
    );
  } else {
    code.push('response = HTTParty.%s(url, headers: headers)', capMethod.toLowerCase());
  }

  code.push('puts(response)');

  return code.join();
};

module.exports.info = {
  key: 'httparty',
  title: 'httparty',
  link: 'https://github.com/jnunemaker/httparty',
  description: 'HTTParty',
};
