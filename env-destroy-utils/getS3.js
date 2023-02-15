import { S3 } from '@aws-sdk/client-s3';

exports.getS3 = ({ environment }) => {
  const s3 = new S3({
    apiVersion: 'latest',
    region: environment.region,
  });

  return s3;
};
