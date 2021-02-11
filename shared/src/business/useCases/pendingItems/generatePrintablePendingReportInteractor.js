const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * generatePrintablePendingReportInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.docketNumber the optional docketNumber filter
 * @returns {Array} the url of the document
 */
exports.generatePrintablePendingReportInteractor = async ({
  applicationContext,
  docketNumber,
  judge,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let pendingDocuments = [];

  if (docketNumber) {
    pendingDocuments = await applicationContext
      .getUseCaseHelpers()
      .fetchPendingItemsByDocketNumber({ applicationContext, docketNumber });
  } else {
    pendingDocuments = (
      await applicationContext
        .getPersistenceGateway()
        .fetchPendingItems({ applicationContext, judge })
    ).foundDocuments;
  }

  const formattedPendingItems = pendingDocuments.map(pendingItem => ({
    ...pendingItem,
    associatedJudgeFormatted: applicationContext
      .getUtilities()
      .formatJudgeName(pendingItem.associatedJudge),
    caseTitle: applicationContext.getCaseTitle(pendingItem.caseCaption || ''),
    docketNumberWithSuffix: `${pendingItem.docketNumber}${
      pendingItem.docketNumberSuffix || ''
    }`,
    formattedFiledDate: applicationContext
      .getUtilities()
      .formatDateString(pendingItem.receivedAt, 'MMDDYY'),
    formattedName: pendingItem.documentTitle || pendingItem.documentType,
  }));

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
    reportTitle = `Docket ${caseResult.docketNumber}${
      caseResult.docketNumberSuffix || ''
    }`;
  }

  const pdf = await applicationContext.getDocumentGenerators().pendingReport({
    applicationContext,
    data: {
      pendingItems: formattedPendingItems,
      subtitle: reportTitle,
    },
  });

  const key = `pending-report-${applicationContext.getUniqueId()}.pdf`;

  await new Promise(resolve => {
    const documentsBucket =
      applicationContext.environment.tempDocumentsBucketName;
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: pdf,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: key,
    };

    s3Client.upload(params, function () {
      resolve();
    });
  });

  const {
    url,
  } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    key: key,
    useTempBucket: true,
  });

  return url;
};
