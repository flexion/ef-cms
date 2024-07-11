import {
  BatchWriteItemCommand,
  DynamoDBClient,
  WriteRequest,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import promiseRetry from 'promise-retry';

export const batchWriteEntries = async (
  client: DynamoDBClient,
  tableName: string,
  entries: any[],
) => {
  let requestItems = entries.map(
    entry =>
      ({
        PutRequest: {
          Item: marshall(entry),
        },
      }) as WriteRequest,
  );

  while (requestItems.length > 0) {
    await promiseRetry(async retry => {
      const results = await client
        .send(
          new BatchWriteItemCommand({
            RequestItems: {
              [tableName]: requestItems,
            },
          }),
        )
        .catch(err => {
          if (err.message.includes('ThrottlingException')) {
            return retry(err);
          }
          throw err;
        });

      requestItems = results.UnprocessedItems?.[tableName] || [];
    });
  }
};
