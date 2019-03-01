module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
    'prettier/standard',
  ],
  plugins: [
    'prettier',
    'react',
    'jsx-a11y',
    'cypress',
    'jsdoc',
    'sort-keys-fix',
  ],
  rules: {
    quotes: ['error', 'single'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
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
    'jsdoc/require-param': 1,
    'jsdoc/require-param-name': 1,
    'jsdoc/check-types': 1,
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'sort-keys-fix/sort-keys-fix': [
      'warn',
      'asc',
      { caseSensitive: false, natural: true },
    ],
  },
  settings: {
    react: {
      version: '16.6.3',
    },
  },
  env: {
    'cypress/globals': true,
    browser: true,
    es6: true,
    mocha: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    jsx: true,
  },
};
