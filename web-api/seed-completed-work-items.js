const AWS = require('aws-sdk');
const faker = require('faker');
const { times } = require('lodash');

const args = process.argv.slice(2);

faker.seed(faker.random.number());

if (args.length < 1) {
  console.error('must provide a table to reindex: [efcms-dev-1]');
  process.exit(1);
}

const tableName = args[0];

console.log('tablename:', tableName);

const dynamo = new AWS.DynamoDB({
  credentials: {
    accessKeyId: 'noop',
    secretAccessKey: 'noop',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

console.log('started dynamo instance');

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
  service: dynamo,
});

console.log('created document client');

const workItems = times(25, () => ({
  assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  assigneeName: 'Test Docketclerk',
  caseIsInProgress: true,
  caseStatus: 'New',
  completedBy: 'Test Docketclerk',
  completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  createdAt: `${faker.date.between('2021-02-16', '2021-02-09')}`,
  docketNumber: '106-19',
  docketNumberSuffix: null,
  document: {
    category: 'Answer (filed by respondent only)',
    createdAt: '2019-07-12T17:11:26.955Z',
    docketNumber: '106-19',
    documentId: `${faker.random.uuid()}`,
    documentTitle: 'Answer',
    documentType: 'Answer',
    eventCode: 'A',
    filedBy: 'Petr. Denise Gould',
    filingDate: '1990-10-10',
    isPaper: true,
    lodged: false,
    numberOfPages: 1,
    partyPrimary: true,
    practitioner: [],
    processingStatus: 'pending',
    receivedAt: '1990-10-10',
    relationship: 'primaryDocument',
    scenario: 'Standard',
    serviceDate: null,
    userId: `${faker.random.uuid()}`,
  },
  gsi1pk: `work-item|${faker.random.uuid()}`,
  pk: 'section-outbox|docket',
  section: 'docket',
  sentBy: 'Test Docketclerk',
  sentBySection: 'docket',
  sentByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
  sk: `${faker.date.between('2021-02-16', '2021-02-09')}`,
  updatedAt: '2019-07-12T17:11:27.244Z',
  workItemId: faker.random.uuid(),
}));

console.log('created workitems', workItems.length);

(async function () {
  console.log('about to batch write');
  await documentClient
    .batchWrite({
      RequestItems: {
        [tableName]: workItems.map(item => ({
          PutRequest: {
            Item: { ...item, indexedTimestamp: Date.now() },
          },
        })),
      },
    })
    .promise();
})();
