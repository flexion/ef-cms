import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { query } from './query';

const FIELD_TO_ADD = 'yetAnotherNewFieldAgain18';

export async function queryByPrefixList(
  client: DynamoDBClient,
  tableName: string,
  indexName: string,
  prefixList: string[],
) {
  const results = await Promise.all(
    prefixList.map(prefix => {
      return query(client, {
        ExpressionAttributeNames: {
          '#nf': FIELD_TO_ADD,
          '#pk': 'entityName',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': { S: 'Case' },
          ':prefix': { S: prefix },
        },
        FilterExpression: 'attribute_not_exists(#nf)',
        IndexName: indexName,
        KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
        TableName: tableName,
      });
    }),
  );

  return results.flat().map(item => item.Item);
}
