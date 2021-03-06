const AWS = require('aws-sdk');

const tableName = process.argv[2];

if (!tableName) {
  console.error('Table name to export is required');
  process.exit(1);
}

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

documentClient
  .scan({
    TableName: tableName,
  })
  .promise()
  .then(documents => {
    console.log(JSON.stringify(documents.Items, null, 2));
  });
