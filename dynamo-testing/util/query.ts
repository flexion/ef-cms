import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import promiseRetry from 'promise-retry';

export async function query(
  client: DynamoDBClient,
  commandInput: QueryCommandInput,
) {
  let results: any[] = [];
  let lastEvaluatedKey: { [key: string]: any } | undefined = undefined;

  do {
    const response = await promiseRetry(async retry => {
      return await client
        .send(
          new QueryCommand({
            ...commandInput,
            ExclusiveStartKey: lastEvaluatedKey,
          }),
        )
        .catch(retry);
    });

    results = results.concat(response.Items || []);
    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return results;
}
