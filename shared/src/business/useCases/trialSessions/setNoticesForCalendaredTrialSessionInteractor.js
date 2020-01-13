const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { PDFDocument } = require('pdf-lib');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Generates notices for all calendared cases for the given trialSessionId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {string} providers.trialSessionId the trial session id
 * @param {string} providers.caseId optional caseId to explicitly set the notice on the ONE specified case
 * @returns {Promise} the promises for the updateCase calls
 */
exports.setNoticesForCalendaredTrialSessionInteractor = async ({
  applicationContext,
  caseId,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let calendaredCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  // opting to pull from the set of calendared cases rather than load the
  // case individually to add an additional layer of validation
  if (caseId) {
    const singleCase = calendaredCases.find(
      caseRecord => caseRecord.caseId === caseId,
    );

    calendaredCases = [singleCase];
  }

  if (calendaredCases.length === 0) {
    return;
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  const newPdfDoc = await PDFDocument.create();

  /**
   * generates a notice of trial session and adds to the case
   *
   * @param {object} caseRecord the case data
   * @returns {object} the raw case object
   */
  const setNoticeForCase = async caseRecord => {
    const caseEntity = new Case(caseRecord, { applicationContext });

    const noticeOfTrialIssued = await applicationContext
      .getUseCases()
      .generateNoticeOfTrialIssuedInteractor({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
        trialSessionId: trialSessionEntity.trialSessionId,
      });

    const newDocumentId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocument({
      applicationContext,
      document: noticeOfTrialIssued,
      documentId: newDocumentId,
    });

    const trialSessionStartDate = applicationContext
      .getUtilities()
      .formatDateString(trialSession.startDate, 'MMDDYYYY');

    const documentTitle = `Notice of Trial on ${trialSessionStartDate} at ${trialSession.trialLocation}`;

    const noticeDocument = new Document(
      {
        caseId: caseEntity.caseId,
        documentId: newDocumentId,
        documentTitle,
        documentType: Document.NOTICE_OF_TRIAL.documentType,
        eventCode: Document.NOTICE_OF_TRIAL.eventCode,
        filedBy: user.name,
        processingStatus: 'complete',
        userId: user.userId,
      },
      { applicationContext },
    );

    caseEntity.addDocument(noticeDocument);
    caseEntity.setNoticeOfTrialDate();

    // Serve notice
    await serveNoticeForCase(caseEntity, noticeDocument, noticeOfTrialIssued);

    const rawCase = caseEntity.validate().toRawObject();
    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: rawCase,
    });

    return rawCase;
  };

  /**
   * serves a notice of trial session on electronic recipients and generates paper
   * notices for those that get paper service
   *
   * @param {object} caseEntity the case entity
   * @param {object} documentEntity the document entity
   * @param {Uint8Array} documentPdfData the pdf data of the document being served
   * @returns {void} sends service emails and updates `newPdfDoc` with paper service pages for printing
   */
  const serveNoticeForCase = async (
    caseEntity,
    documentEntity,
    documentPdfData,
  ) => {
    const servedParties = aggregatePartiesForService(caseEntity);

    const destinations = servedParties.electronic.map(party => ({
      email: party.email,
      templateData: {
        caseCaption: caseEntity.caseCaption,
        docketNumber: caseEntity.docketNumber,
        documentName: documentEntity.documentTitle,
        loginUrl: `https://ui-${process.env.STAGE}.${process.env.EFCMS_DOMAIN}`,
        name: party.name,
        serviceDate: applicationContext.getUtilities().formatNow('MMDDYY'),
        serviceTime: applicationContext.getUtilities().formatNow('TIME'),
      },
    }));

    if (destinations.length > 0) {
      await applicationContext.getDispatchers().sendBulkTemplatedEmail({
        applicationContext,
        defaultTemplateData: {
          caseCaption: 'undefined',
          docketNumber: 'undefined',
          documentName: 'undefined',
          loginUrl: 'undefined',
          name: 'undefined',
          serviceDate: 'undefined',
          serviceTime: 'undefined',
        },
        destinations,
        templateName: process.env.EMAIL_SERVED_TEMPLATE,
      });
    }

    if (servedParties.paper.length > 0) {
      const noticeDoc = await PDFDocument.load(documentPdfData);
      const addressPages = [];

      for (let party of servedParties.paper) {
        addressPages.push(
          await applicationContext
            .getUseCaseHelpers()
            .generatePaperServiceAddressPagePdf({
              applicationContext,
              contactData: party,
              docketNumberWithSuffix: `${
                caseEntity.docketNumber
              }${caseEntity.docketNumberSuffix || ''}`,
            }),
        );
      }

      for (let addressPage of addressPages) {
        const addressPageDoc = await PDFDocument.load(addressPage);
        let copiedPages = await newPdfDoc.copyPages(
          addressPageDoc,
          addressPageDoc.getPageIndices(),
        );
        copiedPages.forEach(page => {
          newPdfDoc.addPage(page);
        });

        copiedPages = await newPdfDoc.copyPages(
          noticeDoc,
          noticeDoc.getPageIndices(),
        );
        copiedPages.forEach(page => {
          newPdfDoc.addPage(page);
        });
      }
    }
  };

  for (var calendaredCase of calendaredCases) {
    await setNoticeForCase(calendaredCase);
  }

  await trialSessionEntity.setNoticesIssued();

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  if (newPdfDoc.getPages().length) {
    const paperServicePdfData = await newPdfDoc.save();
    const paperServicePdfBuffer = Buffer.from(paperServicePdfData);

    return paperServicePdfBuffer;
  }
};
