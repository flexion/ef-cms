import { DeleteObjectCommandOutput } from '@aws-sdk/client-s3';
import { IApplicationContext } from 'types/IApplicationContext';

export const deleteDocumentFile = ({
  applicationContext,
  key,
}: {
  applicationContext: IApplicationContext;
  key: string;
}): Promise<DeleteObjectCommandOutput> => {
  return applicationContext.getStorageClient().deleteObject({
    Bucket: applicationContext.environment.documentsBucketName,
    Key: key,
  });
};
