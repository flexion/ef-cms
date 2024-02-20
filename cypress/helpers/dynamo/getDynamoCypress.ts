import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { chunk } from 'lodash';
import { cypressEnv } from '../env/cypressEnvironment';
import type {
  DeleteRequest,
  PutRequest,
} from '../../../web-api/src/persistence/dynamo/dynamoTypes';

let dynamoCache: DynamoDBClient;
let documentCache: DynamoDBDocument;

export function getDocumentClient(): DynamoDBDocument {
  if (!documentCache) {
    const dynamoEndpoint =
      cypressEnv.env === 'local' ? 'http://localhost:8000' : undefined;
    dynamoCache = new DynamoDBClient({
      credentials: {
        accessKeyId: cypressEnv.accessKeyId,
        secretAccessKey: cypressEnv.secretAccessKey,
        sessionToken: cypressEnv.sessionToken,
      },
      endpoint: dynamoEndpoint,
      region: cypressEnv.region,
    });
    documentCache = DynamoDBDocument.from(dynamoCache, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  return documentCache;
}

export const batchWrite = async (
  commands: (DeleteRequest | PutRequest)[],
): Promise<void> => {
  if (!commands.length) return;

  const documentClient = getDocumentClient();
  const chunks = chunk(commands, 25);

  await Promise.all(
    chunks.map(commandChunk =>
      documentClient.batchWrite({
        RequestItems: {
          [cypressEnv.dynamoDbTableName]: commandChunk,
        },
      }),
    ),
  );

  return;
};
