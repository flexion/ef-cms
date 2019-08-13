const docketclerk = require('./pa11y/pa11y-docketclerk');
const petitionsclerk = require('./pa11y/pa11y-petitionsclerk');
const practitioner = require('./pa11y/pa11y-practitioner');
const respondent = require('./pa11y/pa11y-respondent');
const seniorattorney = require('./pa11y/pa11y-seniorattorney');
const petitioner = require('./pa11y/pa11y-petitioner');
const judge = require('./pa11y/pa11y-judge');

const userUrls = [
  ...judge,
  ...petitioner,
  ...petitionsclerk,
  ...practitioner,
  ...respondent,
  ...docketclerk,
  ...seniorattorney,
];

// see https://github.com/pa11y/pa11y#command-line-interface

module.exports = {
  defaults: {
    chromeLaunchConfig: {
      args: ['--no-sandbox'],
    },
    concurrency: 1,
    debug: true,
    'include-notices': true,
    'include-warnings': true,
    standard: 'WCAG2AA',
    timeout: 30000,
    useIncognitoBrowserContext: true,
    wait: 5000,
  },
  urls: [
    'http://localhost:1234/',
    'http://localhost:1234/mock-login',
    'http://localhost:1234/request-for-page-that-doesnt-exist',
    'http://localhost:1234/idle-logout',
    ...userUrls,
  ],
};
