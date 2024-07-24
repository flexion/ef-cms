import { Agent } from 'https';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { S3 } from '@aws-sdk/client-s3';
import { environment } from '@web-api/environment';
import AWSXRay from 'aws-xray-sdk';

export function getStorageClient(): S3 {
  // if (!s3Cache) {
  //   s3Cache =
  return AWSXRay.captureAWSv3Client(
    new S3({
      endpoint: environment.s3Endpoint,
      forcePathStyle: true,
      maxAttempts: 3,
      region: 'us-east-1',
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 3000,
        httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
        requestTimeout: 30000,
      }),
    }),
  );
  // }
  // return s3Cache;
}
