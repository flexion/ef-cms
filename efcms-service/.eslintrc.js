module.exports = {
  extends: ['prettier', 'eslint:recommended', 'plugin:security/recommended'],
  plugins: ['prettier', 'security', 'jsdoc'],
  rules: {
    quotes: ['error', 'single'],
    'arrow-parens': ['error', 'as-needed'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-useless-escape': 'off',
    'indent': ['error', 2],
    'dot-notation': 'error',
    'dot-location': ["error", "property"],
    "jsdoc/require-param": 1,
    "jsdoc/require-param-description": 1,
    "jsdoc/require-param-name": 1,
    "jsdoc/require-param-type": 1,
    "jsdoc/valid-types": 1,
    "jsdoc/require-returns": 1,
    "jsdoc/require-returns-check": 1,
    "jsdoc/require-returns-description": 1,
    "jsdoc/require-returns-type": 1,
    "jsdoc/newline-after-description": 1,
    "jsdoc/check-param-names": 1,
    "jsdoc/check-types": 1,
  },
  env: {
    es6: true,
    mocha: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 9
  },
};
