const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const { migrateRecords: migrations } = require('./migration-segments');

const client = new DynamoDB({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  maxRetries: 10,
  region: 'us-east-1',
  retryDelayOptions: { base: 300 },
});
const docClient = DynamoDBDocumentClient.from(client);

const processItems = async ({ documentClient, items, migrateRecords }) => {
  const promises = [];

  items = await migrateRecords({ documentClient, items });

  for (const item of items) {
    promises.push(
      documentClient
        .put({
          Item: item,
          TableName: process.env.DESTINATION_TABLE,
        })
        .promise(),
    );
  }
  await Promise.all(promises);
};

const getFilteredGlobalEvents = event => {
  const { Records } = event;
  return Records.filter(item => item.eventName !== 'REMOVE').map(item =>
    DynamoDB.Converter.unmarshall(item.dynamodb.NewImage),
  );
};

const getRemoveEvents = event => {
  const { Records } = event;
  return Records.filter(item => item.eventName === 'REMOVE').map(item =>
    DynamoDB.Converter.unmarshall(item.dynamodb.OldImage),
  );
};

exports.getFilteredGlobalEvents = getFilteredGlobalEvents;
exports.processItems = processItems;
exports.handler = async event => {
  const items = getFilteredGlobalEvents(event);
  await processItems({
    documentClient: docClient,
    items,
    migrateRecords: migrations,
  });

  const removeEvents = getRemoveEvents(event);
  await Promise.all(
    removeEvents.map(item =>
      docClient
        .delete({
          Key: {
            pk: item.pk,
            sk: item.sk,
          },
          TableName: process.env.DESTINATION_TABLE,
        })
        .promise(),
    ),
  );
};
