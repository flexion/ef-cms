import type { Config } from 'jest';

// a global config if running tests singly on CLI
// this file also contains a set of configuration defaults which can
// be imported / overridden as a base configuration elsewhere.

const config: Config = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: './coverage',
  coverageProvider: 'babel',
  globals: {
    Blob,
    TextEncoder,
  },
  testEnvironment: 'jsdom',
  testSequencer: `${__dirname}/jestSequencer.js`,
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { rootMode: 'upward' }],
    '^.+\\.html?$': `${__dirname}/web-client/htmlLoader.js`, //this is to ignore imported html files
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)'],
  verbose: false,
};

// eslint-disable-next-line import/no-default-export
export default config;
