const baseConfig = require('../jest.config');

module.exports = {
  ...baseConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    '!src/**/*_.js',
    '!src/**/getScannerMockInterface.js',
    '!src/applicationContextForTests.js',
    '!src/business/assets/*',
    '!src/business/test/**/*.js',
    '!src/persistence/cognito',
    '!src/persistence/dynamo',
    '!src/persistence/sqs/deleteMessage.js',
    '!src/persistence/sqs/getMessages.js',
    '!src/proxies/**/*.js',
    '!src/sharedAppContext.js',
    '!src/test/**/*.js',
    '!src/tools/**/*.js',
    'src/**/*.js',
  ],
  coverageThreshold: {
    global: {
      branches: 96.13,
      functions: 96.16,
      lines: 98.34,
      statements: 98.25,
    },
  },
  verbose: false,
};
