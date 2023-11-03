export const saveFileAndGenerateUrl = async ({
  applicationContext,
  file,
  fileNamePrefix,
  URLTTL,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  file: Buffer;
  fileNamePrefix?: string;
  useTempBucket?: boolean;
  URLTTL?: number; // time to live of link in seconds
}): Promise<{
  fileId: string;
  url: string;
}> => {
  const fileId = applicationContext.getUniqueId();

  const fileName = fileNamePrefix ? `${fileNamePrefix}${fileId}` : fileId;

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: file,
    key: fileName,
    useTempBucket,
  });

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      URLTTL,
      applicationContext,
      key: fileName,
      useTempBucket,
    });

  return { fileId, url };
};
