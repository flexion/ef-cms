const sanitize = require('sanitize-filename');
const {
  BATCH_DOWNLOAD_TRIAL_SESSION,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const {
  generatePdfFromHtml,
} = require('../../useCaseHelper/pdf/generatePdfFromHtml');
const { formatDateString } = require('../../../business/utilities/DateHandler');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * batchDownloadTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session
 * @returns {Promise} the promise of the batchDownloadTrialSessionInteractor call
 */
exports.batchDownloadTrialSessionInteractor = async ({
  applicationContext,
  caseHtml,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, BATCH_DOWNLOAD_TRIAL_SESSION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionDetails = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const sessionCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  let s3Ids = [];
  let fileNames = [];
  let extraFiles = [];
  let extraFileNames = [];

  const trialDate = formatDateString(
    trialSessionDetails.startDate,
    'MMMM_D_YYYY',
  );

  const trialLocation = trialSessionDetails.trialLocation
    .replace(/\s/g, '_')
    .replace(/,/g, '');

  const zipName = sanitize(`${trialDate}_${trialLocation}.zip`);

  sessionCases.forEach(caseToBatch => {
    caseToBatch.documents.forEach(document => {
      s3Ids.push(document.documentId);
      fileNames.push(
        `${caseToBatch.docketNumber}/${document.documentType}.pdf`,
      );
    });
  });

  for (let index = 0; index < sessionCases.length; index++) {
    let { caseId, docketNumber } = sessionCases[index];
    extraFiles.push(
      generatePdfFromHtml({
        applicationContext,
        contentHtml: caseHtml[caseId],
        docketNumber,
      }),
    );
    extraFileNames.push(`${docketNumber}/Docket Record.pdf`);
  }

  await applicationContext.getPersistenceGateway().zipDocuments({
    applicationContext,
    extraFileNames,
    extraFiles,
    fileNames,
    s3Ids,
    zipName,
  });

  const results = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      documentId: zipName,
    });

  return results;
};
