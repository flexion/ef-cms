import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getEnv } from '../config/getEnv';
import { getS3Client } from './getS3Client';

export const saveTemporaryDocument = ({
  document: body,
  key,
}: {
  document: any;
  key: string;
}) => {
  const client = getS3Client();

  return client.send(
    new PutObjectCommand({
      Body: Buffer.from(body),
      Bucket: getEnv().TEMP_DOCUMENTS_BUCKET_NAME,
      ContentType: 'application/pdf',
      Key: key,
    }),
  );
};
