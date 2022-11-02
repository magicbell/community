export default function graphql(hljs) {
  const GQL_NAME = '[_A-Za-z][_0-9A-Za-z]*';
  const GQL_PUNCTUATION = '[\\!\\(\\)\\:\\=\\[\\]\\{\\|\\}]{1}';
  return {
    name: 'graphql',
    aliases: ['gql'],
    case_insensitive: true,
    disableAutodetect: false,
    keywords: {
      keyword: [
        'query',
        'mutation',
        'subscription|10',
        'type',
        'input',
        'schema',
        'directive',
        'interface',
        'union',
        'scalar',
        'fragment|10',
        'enum',
        'on',
      ],
      literal: 'true false null',
    },
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE,
      {
        className: 'punctuation',
        begin: '[.]{2}',
        end: '\\.',
      },
      {
        className: 'punctuation',
        begin: GQL_PUNCTUATION,
      },
      {
        className: 'variable',
        begin: '\\$',
        end: '\\W',
        excludeEnd: true,
      },
      {
        className: 'meta',
        begin: '@',
        end: '\\W',
        excludeEnd: true,
      },
      {
        className: 'symbol',
        begin: GQL_NAME + '\\s*:',
        returnBegin: true,
        contains: [
          {
            className: 'symbol',
            begin: GQL_NAME,
            end: '\\s*:',
            excludeEnd: true,
          },
        ],
      },
    ],
    illegal: /([;<']|BEGIN)/,
  };
}
