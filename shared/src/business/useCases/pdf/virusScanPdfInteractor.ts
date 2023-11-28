import { IApplicationContext } from 'types/IApplicationContext';
import fs from 'fs';
import tmp from 'tmp';

export const virusScanPdfInteractor = async (
  applicationContext: IApplicationContext,
  {
    key,
    scanCompleteCallback,
  }: { key: string; scanCompleteCallback: () => void },
): Promise<void> => {
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.quarantineBucketName,
      Key: key,
    });

  const inputPdf = tmp.fileSync({
    mode: 0o644,
    tmpdir: process.env.TMP_PATH,
  });
  fs.writeSync(inputPdf.fd, Buffer.from(pdfData));
  fs.closeSync(inputPdf.fd);

  try {
    await applicationContext.runVirusScan({ filePath: inputPdf.name });

    await applicationContext.getStorageClient().putObject({
      Body: pdfData,
      Bucket: applicationContext.environment.documentsBucketName,
      ContentType: 'application/pdf',
      Key: key,
    });

    await applicationContext.getStorageClient().deleteObject({
      Bucket: applicationContext.environment.quarantineBucketName,
      Key: key,
    });

    await scanCompleteCallback();
  } catch (e) {
    if (e.code === 1) {
      await scanCompleteCallback();
      applicationContext.logger.info('File was infected', e);
    } else {
      applicationContext.logger.error('Failed to scan', e);
    }
  }
};
