export const getDocument = async ({
  applicationContext,
  key,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  key: string;
  useTempBucket?: boolean;
}) => {
  const S3 = applicationContext.getStorageClient();
  return (
    await S3.getObject({
      Bucket: useTempBucket
        ? applicationContext.environment.tempDocumentsBucketName
        : applicationContext.environment.documentsBucketName,
      Key: key,
    }).promise()
  ).Body;
};
