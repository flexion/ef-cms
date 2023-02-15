const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const {
  processItems,
} = require('./migration-terraform/main/lambdas/migration-segments');

(async () => {
  const dynamo = new DynamoDB({
    credentials: {
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER',
    },
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
  });

  const documentClient = DynamoDBDocumentClient.from(dynamo);

  await documentClient
    .scan({
      ExclusiveStartKey: null,
      Segment: 0,
      TableName: process.env.SOURCE_TABLE,
      TotalSegments: 1,
    })
    .promise()
    .then(async results => {
      await processItems({ documentClient, items: results.Items });
    });
})();
