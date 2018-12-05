const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
});

const deleteTable = async tableName => {
  try {
    return await dynamo
      .deleteTable({
        TableName: tableName,
      })
      .promise();
  } catch (error) {
    // ResourceNotFoundException
    return Promise.resolve();
  }
};
const createDocumentsTable = async () => {
  await deleteTable('efcms-documents-local');
  console.log('Creating Documents Table');
  return dynamo
    .createTable({
      TableName: 'efcms-documents-local',
      KeySchema: [
        {
          AttributeName: 'documentId',
          KeyType: 'HASH',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'documentId',
          AttributeType: 'S',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    })
    .promise();
};

const createCasesTable = async () => {
  console.log('Creating Cases Table');
  await deleteTable('efcms-cases-local');
  return dynamo
    .createTable({
      TableName: 'efcms-cases-local',
      KeySchema: [
        {
          AttributeName: 'caseId',
          KeyType: 'HASH',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'caseId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'docketNumber',
          AttributeType: 'S',
        },
        {
          AttributeName: 'userId',
          AttributeType: 'S',
        },
        {
          AttributeName: 'status',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'DocketNumberIndex',
          KeySchema: [
            {
              AttributeName: 'docketNumber',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'StatusIndex',
          KeySchema: [
            {
              AttributeName: 'status',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'UserIdIndex',
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'caseId',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    })
    .promise();
};

(async () => {
  await createDocumentsTable();
  await createCasesTable();
})();
