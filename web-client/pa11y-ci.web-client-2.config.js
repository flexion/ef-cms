const calendarclerk = require('./pa11y/pa11y-calendarclerk');
const petitionsclerk = require('./pa11y/pa11y-petitionsclerk');
const practitioner = require('./pa11y/pa11y-practitioner');
const respondent = require('./pa11y/pa11y-respondent');

const urls = [
  ...calendarclerk,
  ...petitionsclerk,
  ...practitioner,
  ...respondent,
];

// see https://github.com/pa11y/pa11y#command-line-interface

module.exports = {
  defaults: {
    chromeLaunchConfig: {
      args: ['--no-sandbox'],
    },
    concurrency: 3,
    debug: true,
    'include-notices': true,
    'include-warnings': true,
    standard: 'WCAG2AA',
    timeout: 30000,
    useIncognitoBrowserContext: true,
    wait: 5000,
  },
  urls,
};
