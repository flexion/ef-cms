import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getEnv } from '../config/getEnv';
import { getS3Client } from './getS3Client';

export const getTemporaryDocument = ({ key }: { key: string }) => {
  const client = getS3Client();

  return client.send(
    new GetObjectCommand({
      Bucket: getEnv().TEMP_DOCUMENTS_BUCKET_NAME,
      Key: key,
    }),
  );
};
