import { S3Client } from '@aws-sdk/client-s3';
import { getEnv } from '../config/getEnv';

export function getS3Client() {
  return new S3Client({
    credentials: {
      accessKeyId: getEnv().AWS_ACCESS_KEY_ID,
      secretAccessKey: getEnv().AWS_SECRET_ACCESS_KEY,
    },
    endpoint: getEnv().S3_ENDPOINT,
    forcePathStyle: true,
  });
}
