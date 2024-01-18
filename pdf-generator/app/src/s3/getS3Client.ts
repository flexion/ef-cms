import { S3Client } from '@aws-sdk/client-s3';
import { getEnv } from '../config/getEnv';

export function getS3Client() {
  const config = {
    endpoint: getEnv().S3_ENDPOINT,
    forcePathStyle: true,
  };
  if (getEnv().NODE_ENV !== 'production') {
    (config as any).credentials = {
      accessKeyId: getEnv().AWS_ACCESS_KEY_ID,
      secretAccessKey: getEnv().AWS_SECRET_ACCESS_KEY,
    };
  }
  console.log('config', config);
  return new S3Client(config);
}
