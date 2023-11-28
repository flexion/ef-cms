import { IApplicationContext } from 'types/IApplicationContext';

export const isFileExists = async ({
  applicationContext,
  key,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  key: string;
  useTempBucket?: boolean;
}): Promise<boolean> => {
  try {
    await applicationContext.getStorageClient().headObject({
      Bucket: useTempBucket
        ? applicationContext.getTempDocumentsBucketName()
        : applicationContext.getDocumentsBucketName(),
      Key: key,
    });
    return true;
  } catch (headErr) {
    return false;
  }
};
