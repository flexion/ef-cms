import { logLambdaStats } from '@web-api/lambdas/pdfGeneration/lambdaStats';
import { getChromiumBrowser } from '@shared/business/utilities/getChromiumBrowser';
import { applicationContext } from '@web-api/applicationContext';
import { Browser } from 'puppeteer-core';

export type PdfGenerationResult = {
  tempId: string;
};

export const handler = async event => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 100;
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  let browser: Browser;

  console.log('PDF Investigation: About to get chromium browser');
  logLambdaStats();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `PDF Investigation: Attempt ${attempt} to get chromium browser`,
      );
      logLambdaStats();

      browser = await getChromiumBrowser();

      console.log(
        `PDF Investigation: chromium browser launched on attempt ${attempt}`,
      );
      break;
    } catch (err) {
      console.error(
        `PDF Investigation: attempt ${attempt} failed with error:`,
        err,
      );

      logLambdaStats();
      if (attempt < MAX_RETRIES) {
        console.log(
          `PDF Investigation: Retrying after ${RETRY_DELAY_MS * Math.pow(2, attempt - 1)}ms`,
        );
        await delay(RETRY_DELAY_MS * Math.pow(2, attempt - 1));
      } else {
        throw new Error('Failed to launch chromium after multiple attempts.');
      }
    }
  }

  logLambdaStats();
  console.log('PDF Investigation: About to generate pdf from html');

  const results = await applicationContext
    .getUseCaseHelpers()
    .generatePdfFromHtmlHelper(applicationContext, event, browser!);

  const pages = await browser!.pages();
  await Promise.all(pages.map(p => p.close()));

  console.log(
    'PDF Investigation: Finished generating pdf; about to close browser',
  );

  console.log('PDF Investigation: Closed browser');
  logLambdaStats();

  const tempId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: results,
    key: tempId,
    useTempBucket: true,
  });

  return { tempId };
};

export const changeOfAddressHandler = async event => {
  const { Records } = event;
  const { body } = Records[0];
  const eventBody = JSON.parse(body);

  applicationContext.logger.info(
    `processing job "change-of-address-job|${eventBody.jobId}", task for case ${eventBody.docketNumber}`,
  );

  await applicationContext.getUseCaseHelpers().generateChangeOfAddressHelper({
    applicationContext,
    authorizedUser: eventBody.requestUser,
    bypassDocketEntry: eventBody.bypassDocketEntry,
    contactInfo: eventBody.contactInfo,
    docketNumber: eventBody.docketNumber,
    firmName: eventBody.firmName,
    jobId: eventBody.jobId,
    requestUserId: eventBody.requestUserId,
    updatedEmail: eventBody.updatedEmail,
    updatedName: eventBody.updatedName,
    user: eventBody.user,
    websocketMessagePrefix: eventBody.websocketMessagePrefix,
  });
};
