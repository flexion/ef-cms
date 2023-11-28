import { IApplicationContext } from 'types/IApplicationContext';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { Upload } from '@aws-sdk/lib-storage';

export const generatePrintablePendingReportInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber, judge }: { docketNumber?: string; judge?: string },
): Promise<string> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { foundDocuments: pendingDocuments } = await applicationContext
    .getPersistenceGateway()
    .fetchPendingItems({
      applicationContext,
      docketNumber,
      judge,
    });

  const formattedPendingItems = pendingDocuments.map(pendingItem =>
    applicationContext
      .getUtilities()
      .formatPendingItem(pendingItem, { applicationContext }),
  );

  let reportTitle = 'All Judges';

  if (judge) {
    reportTitle = `Judge ${judge}`;
  } else if (docketNumber) {
    const caseResult = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });
    reportTitle = `Docket ${caseResult.docketNumberWithSuffix}`;
  }

  const pdf = await applicationContext.getDocumentGenerators().pendingReport({
    applicationContext,
    data: {
      pendingItems: formattedPendingItems,
      subtitle: reportTitle,
    },
  });

  const key = `pending-report-${applicationContext.getUniqueId()}.pdf`;

  const upload = new Upload({
    client: applicationContext.getStorageClient(),
    params: {
      Body: pdf,
      Bucket: applicationContext.environment.tempDocumentsBucketName,
      ContentType: 'application/pdf',
      Key: key,
    },
  });

  await upload.done();

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      key,
      useTempBucket: true,
    });

  return url;
};
