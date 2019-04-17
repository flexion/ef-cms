module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'prettier/react',
    'prettier/standard',
  ],
  plugins: [
    'cypress',
    'eslint-plugin-sort-imports-es6-autofix',
    'jest',
    'jsdoc',
    'jsx-a11y',
    'prettier',
    'react',
    'sort-keys-fix',
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'jsdoc/check-param-names': 1,
    'jsdoc/check-types': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/require-param-type': 1,
    'jsdoc/require-param': 1,
    'jsdoc/require-returns-check': 1,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-returns-type': 1,
    'jsdoc/require-returns': 1,
    'jsdoc/valid-types': 1,
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'prettier/prettier': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'jsx-a11y/label-has-for': [
      2,
      {
        components: ['Label'],
        required: {
          every: ['id'],
        },
        allowChildren: false,
      },
    ],
    'sort-imports-es6-autofix/sort-imports-es6': [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],

    'sort-keys-fix/sort-keys-fix': [
      'error',
      'asc',
      { caseSensitive: true, natural: true },
    ],
  },
  settings: {
    react: {
      version: '16.8.3',
    },
  },
  env: {
    'cypress/globals': true,
    'jest/globals': true,
    browser: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    jsx: true,
    sourceType: 'module',
  },
};
