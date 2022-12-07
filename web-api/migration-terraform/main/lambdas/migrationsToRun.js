const {
  migrateItems: migration0001,
} = require('./migrations/0001-default-court-issued-filing-date-to-served-at');

// MODIFY THIS ARRAY TO ADD NEW MIGRATIONS OR REMOVE OLD ONES
const migrationsToRun = [
  {
    key: '0001-default-court-issued-filing-date-to-served-at.js',
    script: migration0001,
  },
];

exports.migrationsToRun = migrationsToRun;
