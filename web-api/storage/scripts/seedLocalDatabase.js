const AWS = require('aws-sdk');
const seedEntries = require('../fixtures/seed');
const { createUsers } = require('./createUsers');
const { createCase1 } = require('./cases/createCase1');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = 'noop';
AWS.config.secretAccessKey = 'noop';
AWS.config.region = 'us-east-1';

const client = new AWS.DynamoDB.DocumentClient({
  credentials: {
    accessKeyId: 'noop',
    secretAccessKey: 'noop',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

const putEntries = async entries => {
  await Promise.all(
    entries.map(item =>
      client
        .put({
          Item: item,
          TableName: 'efcms-local',
        })
        .promise(),
    ),
  );
};

module.exports.seedLocalDatabase = async entries => {
  if (entries) {
    await putEntries(entries);
  } else {
    await createUsers();
    await putEntries(seedEntries);
    await createCase1();
  }
};
