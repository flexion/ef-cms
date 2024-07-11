import { Agent } from 'https';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NodeHttpHandler } from '@smithy/node-http-handler';

export const client = new DynamoDBClient({
  maxAttempts: 20,
  region: 'us-east-1',
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 10000,
    httpsAgent: new Agent({ keepAlive: true }),
    requestTimeout: 10000,
  }),
});
