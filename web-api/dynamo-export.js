import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const tableName = process.argv[2] ?? 'efcms-local';

if (!tableName) {
  console.error('Table name to export is required');
  process.exit(1);
}

const client = new DynamoDB({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});
const documentClient = DynamoDBDocumentClient.from(client);

documentClient
  .scan({
    TableName: tableName,
  })
  .promise()
  .then(documents => {
    documents.Items.sort((a, b) => {
      return `${a.pk}-${a.sk}`.localeCompare(`${b.pk}-${b.sk}`);
    });
    console.log(JSON.stringify(documents.Items, null, 2));
  });
