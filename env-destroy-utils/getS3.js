import { S3Client } from '@aws-sdk/client-s3';

exports.getS3 = ({ environment }) => {
  const s3 = new S3Client({
    apiVersion: 'latest',
    region: environment.region,
  });

  return s3;
};
