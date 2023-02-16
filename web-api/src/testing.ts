const {
  // DynamoDBDocument,
  DynamoDBDocument,
  DynamoDBDocumentClient,
} = require('@aws-sdk/lib-dynamodb');
const { DynamoDB, DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const getDocumentClient = () => {
  const client = DynamoDBDocument.from(
    new DynamoDB({
      endpoint: 'http://localhost:8000',
      httpOptions: {
        timeout: 5000,
      },
      maxRetries: 3,
      region: 'us-east-1',
    }),
    {
      marshallOptions: {
        removeUndefinedValues: true,
      },
      unmarshallOptions: {
        wrapNumbers: false,
      },
    },
  );

  return client;
};

const client = getDocumentClient();

client.put({
  Item: {
    pk: 'hello',
    sk: 'workd',
  },
  TableName: 'efcms-local',
});
