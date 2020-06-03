/* eslint-disable spellcheck/spell-checker */
// re-format this file with `npx eslint --ignore-pattern '!.eslintrc.js' .eslintrc.js --fix`
module.exports = {
  env: {
    browser: true,
    'cypress/globals': true,
    es6: true,
    'jest/globals': true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:cypress/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jest/recommended',
    'plugin:jsdoc/recommended',
    // 'plugin:jsx-a11y/recommended', // todo
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:react/recommended',
    'plugin:security/recommended',
    'prettier/react',
    'prettier/standard',
  ],
  overrides: [
    {
      files: ['cypress/**/*.js', 'cypress-smoketests/**/*.js'],
      rules: {
        'jest/expect-expect': 'off',
        'jest/valid-expect': 'off',
        'promise/always-return': 'off',
        'promise/catch-or-return': 'off',
      },
    },
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 9,
    jsx: true,
    sourceType: 'module',
  },
  plugins: [
    'cypress',
    'import',
    'jest',
    'jsdoc',
    'jsx-a11y',
    'prettier',
    'promise',
    'react',
    'security',
    'sort-destructure-keys',
    'sort-imports-es6-autofix',
    'sort-keys-fix',
    'sort-requires',
    'spellcheck',
  ],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    complexity: ['warn', { max: 80 }], // todo: plugin default is 20, try to lower this
    'import/named': 'warn',
    'import/no-default-export': 'error',
    'import/no-named-as-default': 'off',
    'jest/expect-expect': 'warn',
    'jest/no-export': 'off',
    'jest/no-identical-title': 'off', // todo: warn
    'jest/no-test-callback': 'warn',
    'jsdoc/check-alignment': 'off', // todo: warn
    'jsdoc/check-param-names': 'off', // todo: warn
    'jsdoc/check-tag-names': 'off', // todo: warn
    'jsdoc/check-types': 'off', // todo: warn
    'jsdoc/newline-after-description': 'warn',
    'jsdoc/no-undefined-types': 'off', // todo: warn
    'jsdoc/require-jsdoc': 'warn',
    'jsdoc/require-param': 'off', // todo: warn
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-name': 'warn',
    'jsdoc/require-param-type': 'warn',
    'jsdoc/require-returns': 'warn',
    'jsdoc/require-returns-check': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'jsdoc/require-returns-type': 'warn',
    'jsdoc/valid-types': 'warn',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'jsx-a11y/label-has-for': [
      'error',
      {
        allowChildren: false,
        components: ['Label'],
        required: {
          every: ['id'],
        },
      },
    ],
    'no-irregular-whitespace': ['error', { skipStrings: false }],
    'no-prototype-builtins': 'off',
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-var': 'error',
    'no-warning-comments': [
      'error',
      { location: 'anywhere', terms: ['fixme', 'xxx'] },
    ],
    'prefer-destructuring': [
      'error',
      {
        AssignmentExpression: {
          array: false,
          object: true,
        },
        VariableDeclarator: {
          array: false,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'prettier/prettier': 'error',
    'promise/always-return': 'off', // todo: warn
    'promise/avoid-new': 'off', // todo: warn
    'promise/catch-or-return': 'off', // todo: warn
    'promise/no-callback-in-promise': 'warn',
    'promise/no-native': 'off',
    'promise/no-nesting': 'warn',
    'promise/no-new-statics': 'error',
    'promise/no-promise-in-callback': 'warn',
    'promise/no-return-in-finally': 'warn',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/valid-params': 'warn',
    quotes: ['error', 'single', { avoidEscape: true }],
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        ignoreCase: false,
        noSortAlphabetically: false,
        shorthandFirst: true,
        shorthandLast: false,
      },
    ],
    'react/prop-types': 'off',
    'require-atomic-updates': 'off',
    'security/detect-child-process': 'off',
    'security/detect-non-literal-fs-filename': 'off',
    'security/detect-object-injection': 'off',
    'sort-destructure-keys/sort-destructure-keys': [
      'error',
      { caseSensitive: false },
    ],
    'sort-imports-es6-autofix/sort-imports-es6': [
      'error',
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
    'sort-requires/sort-requires': 'error',
    'spellcheck/spell-checker': [
      'warn',
      {
        comments: true,
        identifiers: false,
        lang: 'en_US',
        minLength: 4,
        skipIfMatch: ['https?://[^\\s]{10,}', '^[^\\s]{35,}$'],
        skipWords: [
          'anthony',
          'args',
          'armen',
          'armens',
          'ashford',
          'ashfords',
          'assignee',
          'async',
          'attributors',
          'backend',
          'binded',
          'boolean',
          'booleans',
          'buch',
          'buchs',
          'cancelable',
          'carluzzo',
          'carluzzos',
          'checkbox',
          'cognito',
          'cohen',
          'cohens',
          'colvin',
          'colvins',
          'contentinfo',
          'copelands',
          'cors',
          'coversheet',
          'desc',
          'disallowance',
          'dispositive',
          'docketclerk',
          'doctype',
          'douglass',
          'dynam',
          'dynamodb',
          'dynamsoft',
          'efcms',
          'elasticsearch',
          'eslint',
          'falsy',
          'fieldset',
          'fieri',
          'flavortown',
          'focusable',
          'foleys',
          'fontawesome',
          'formatter',
          'fortawesome',
          'gerbers',
          'getter',
          'globals',
          'goeke',
          'goekes',
          'goto',
          'gsi1',
          'gsi1pk',
          'gustafson',
          'gustafsons',
          'halpern',
          'halperns',
          'hapi',
          'holmes',
          'hoverable',
          'href',
          'html',
          'http',
          'https',
          'iframe',
          'interactor',
          'irs',
          'istanbul',
          'jacobs',
          'jpg',
          'jsdom',
          'kerrigan',
          'kerrigans',
          'keydown',
          'labelledby',
          'lauber',
          'laubers',
          'leyden',
          'leydens',
          'listitem',
          'localhost',
          'lodash',
          'maxw',
          'memoranda',
          'metadata',
          'middleware',
          'middlewares',
          'minw',
          'morrisons',
          'mousedown',
          'multipart',
          'namespace',
          'navbar',
          'nega',
          'negas',
          'noop',
          'noopener',
          'noreferrer',
          'overline',
          'panuthos',
          'panuthos',
          'param',
          'params',
          'paris',
          'pdfjs',
          'petitionsclerk',
          'petr',
          'petrs',
          'polyfill',
          'postfix',
          'prepends',
          'pughs',
          'px',
          'ramsay',
          'rect',
          'reindex',
          'renderer',
          'rescan',
          'restapi',
          'riker',
          'ruwe',
          'ruwes',
          'scss',
          'semibold',
          'seriatim',
          'servoss',
          'sisqo',
          'skipnav',
          'sortable',
          'stanton',
          'stin',
          'stip',
          'submenu',
          'tabbable',
          'tabindex',
          'tablist',
          'tabpanel',
          'templated',
          'textarea',
          'thorton',
          'thortons',
          'touchmove',
          'transferee',
          'truthy',
          'tubman',
          'uint',
          'unassociated',
          'unconsolidate',
          'unconsolidated',
          'uniq',
          'unmount',
          'unprioritize',
          'unprocessable',
          'unsanitized',
          'unset',
          'unsets',
          'unsetting',
          'unstash',
          'unstyled',
          'unsworn',
          'urda',
          'urdas',
          'usa',
          'ustaxcourt',
          'ustc',
          'uuid',
          'uuidv4',
          'vasquezs',
          'viewport',
          'washington',
          'whistleblower',
          'whitelist',
          'wicg',
          'workitem',
          'workitems',
          'xpos',
        ],
        strings: false,
        templates: false,
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
    react: {
      version: '16.12.0',
    },
  },
};
