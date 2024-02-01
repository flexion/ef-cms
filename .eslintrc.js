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
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'plugin:react/recommended',
    'prettier',
    'plugin:security/recommended-legacy',
    'plugin:import/typescript',
    // 'plugin:jsx-a11y/recommended', // todo
  ],
  ignorePatterns: [
    '**/*_.js',
    './cypress.config.ts',
    './cypress-smoketests.config.ts',
    './cypress-smoketests-readonly.config.ts',
    './cypress-smoketests-readonly-public.config.ts',
    './cypress-public.config.ts',
    'scripts/run-once-scripts/**/*',
  ],
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'], // Disables type information from needing to be output, and clashing tsconfig/eslint issues https://typescript-eslint.io/linting/typed-linting#how-can-i-disable-type-aware-linting-for-a-subset-of-files
      files: ['*.js', 'cypress/**/*.ts', 'webpack.config**'],
    },
    {
      files: ['cypress/**/*.ts'],
      rules: {
        'cypress/unsafe-to-chain-command': 'warn',
        'jest/expect-expect': 'off',
        'jest/valid-describe-callback': 'off',
        'jest/valid-expect': 'off',
        'jest/valid-expect-in-promise': 'off',
        'no-underscore-dangle': 'off',
        'promise/always-return': 'off',
        'promise/catch-or-return': 'off',
      },
    },
    {
      files: [
        'web-client/integration-tests/**/*.js',
        'web-client/integration-tests-public/**/*.js',
      ],
      rules: {
        'jest/expect-expect': 'off',
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        'no-undef': 'off',
        'no-underscore-dangle': 'off',
        'no-unused-vars': 'off',
      },
    },
    {
      files: ['**/*.test.js'],
      rules: {
        'max-lines': [
          'error',
          { max: 500, skipBlankLines: true, skipComments: true },
        ],
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 9,
    jsx: true,
    project: ['./tsconfig.json'],
    requireConfigFile: false,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'cypress',
    'import',
    'jest',
    'jsx-a11y',
    '@miovision/disallow-date',
    '@typescript-eslint',
    'prettier',
    'promise',
    'react',
    'sort-destructure-keys',
    'sort-imports-es6-autofix',
    'sort-keys-fix',
    'sort-requires-fix',
    'spellcheck',
  ],
  rules: {
    '@miovision/disallow-date/no-new-date': 1,
    '@miovision/disallow-date/no-static-date': 0,
    '@miovision/disallow-date/no-to-date': 0,
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    complexity: ['warn', { max: 20 }], // todo: plugin default is 20; set to 'error'
    'eol-last': ['error', 'always'],
    'id-denylist': ['error', /* 'error', 'err', 'cb', 'callback',*/ 'test'],
    'import/no-default-export': 'error',
    'import/no-named-as-default': 'off',
    'jest/expect-expect': 'off',
    'jest/no-conditional-expect': 'off',
    'jest/no-export': 'off',
    'jest/no-identical-title': 'off', // todo: warn
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
    'max-lines': [
      'error',
      { max: 700, skipBlankLines: true, skipComments: true },
    ],
    'no-irregular-whitespace': ['error', { skipStrings: false }],
    'no-prototype-builtins': 'off',
    'no-restricted-globals': [
      'error',
      { name: 'error' },
      { name: 'event' },
      { name: 'status' },
      { name: 'name' },
      { name: 'document' },
    ],
    'no-shadow': ['error', { builtinGlobals: false }],
    'no-trailing-spaces': 'error',
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-unneeded-ternary': ['error', { defaultAssignment: false }],
    'no-var': 'error',
    'no-warning-comments': [
      'error',
      { location: 'anywhere', terms: ['fixme', 'xxx'] },
    ],
    'object-shorthand': 'warn',
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
    'react/no-array-index-key': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'warn',
    'require-atomic-updates': 'off',
    'require-await': 'warn',
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
    'sort-requires-fix/sort-requires-fix': 'error',
    'spellcheck/spell-checker': [
      'warn',
      {
        comments: true,
        identifiers: false,
        lang: 'en_US',
        minLength: 4,
        skipIfMatch: ['https?://[^\\s]{10,}', '^[^\\s]{35,}$', 'eslint\\-.*$'],
        skipWords: [
          'anthony',
          'apigateway',
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
          'court’s',
          'coversheet',
          'desc',
          'devex',
          'disallowance',
          'dispositive',
          'docketclerk',
          'doctype',
          'douglass',
          'dropdown',
          'dynam',
          'dynamodb',
          'dynamsoft',
          'efcms',
          'elasticsearch',
          'enum',
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
          'isn’t',
          'istanbul',
          'jacobs',
          'jpg',
          'jsdom',
          'judge’s',
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
          'luxon',
          'marshall',
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
          'serverless',
          'servable',
          'servoss',
          'sisqo',
          'skipnav',
          'sortable',
          'stanton',
          'stin',
          'stip',
          'stringified',
          'stringifying',
          'submenu',
          'tabbable',
          'tabindex',
          'tablist',
          'tabpanel',
          'templated',
          'textarea',
          'thorton',
          'thortons',
          'todays',
          'touchmove',
          'transferee',
          'transpile',
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
          'unservable',
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
          'validators',
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
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      },
    },
    react: {
      version: '17.0.2',
    },
  },
};
