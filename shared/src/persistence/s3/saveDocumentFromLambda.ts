const { PutObjectCommand } = require('@aws-sdk/client-s3');
export const saveDocumentFromLambda = async ({
  applicationContext,
  contentType: ContentType = 'application/pdf',
  document: body,
  key,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  contentType?: string;
  document: any;
  key: string;
  useTempBucket?: boolean;
}) => {
  let Bucket = applicationContext.getDocumentsBucketName();
  if (useTempBucket) {
    Bucket = applicationContext.getTempDocumentsBucketName();
  }

  const maxRetries = 1;

  let response;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const command = new PutObjectCommand({
        Body: Buffer.from(body),
        Bucket,
        ContentType,
        Key: key,
      });
      response = await applicationContext.getStorageClient().send(command);
      break;
    } catch (err) {
      if (i >= maxRetries) {
        applicationContext.logger.error(
          'An error occurred while attempting to save the document',
          { error: err },
        );
        throw err;
      }
    }
  }

  return response;
};
