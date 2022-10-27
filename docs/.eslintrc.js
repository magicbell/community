module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', 'jest', 'no-only-tests'],
  rules: {
    'no-only-tests/no-only-tests': 'error',
    'react/no-unescaped-entities': 'warn',

    // ease migration, ideally we enable this
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, varsIgnorePattern: 'jsx|^_', argsIgnorePattern: '^_' },
    ],
  },
  overrides: [
    {
      files: ['tests/**/*.test.js'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
    },
  ],
  globals: {
    JSX: true,
  },
};
