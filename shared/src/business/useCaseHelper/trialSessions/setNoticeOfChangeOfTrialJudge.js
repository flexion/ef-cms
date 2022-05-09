const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  CASE_STATUS_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../entities/EntityConstants');
const { DocketEntry } = require('../../entities/DocketEntry');
const { getJudgeWithTitle } = require('../../utilities/getJudgeWithTitle');

const serveNoticesForCase = async (
  applicationContext,
  {
    caseEntity,
    newPdfDoc,
    noticeDocketEntryEntity,
    noticeDocumentPdfData,
    PDFDocument,
    servedParties,
  },
) => {
  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: noticeDocketEntryEntity.docketEntryId,
    servedParties,
  });

  if (servedParties.paper.length > 0) {
    const noticeDocumentPdf = await PDFDocument.load(noticeDocumentPdfData);

    await applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf({
        applicationContext,
        caseEntity,
        newPdfDoc,
        noticeDoc: noticeDocumentPdf,
        servedParties,
      });
  }
};

/**
 * setNoticeOfChangeOfTrialJudge
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseEntity the case data
 * @param {object} providers.currentTrialSession the old trial session data
 * @param {object} providers.newPdfDoc the new PDF contents to be appended
 * @param {object} providers.newTrialSessionEntity the new trial session data
 * @param {object} providers.PDFDocument the PDF document to append to
 * @param {object} providers.userId the user ID
 * @returns {Promise<void>} the created trial session
 */
exports.setNoticeOfChangeOfTrialJudge = async (
  applicationContext,
  {
    caseEntity,
    currentTrialSession,
    newPdfDoc,
    newTrialSessionEntity,
    PDFDocument,
    userId,
  },
) => {
  const shouldIssueNoticeOfChangeOfTrialJudge =
    currentTrialSession.isCalendared &&
    currentTrialSession.judge?.userId !== newTrialSessionEntity.judge?.userId &&
    caseEntity.status !== CASE_STATUS_TYPES.closed;

  if (shouldIssueNoticeOfChangeOfTrialJudge) {
    const priorJudgeTitleWithFullName = await getJudgeWithTitle({
      applicationContext,
      judgeUserName: currentTrialSession.judgeName,
      shouldReturnFullName: true,
    });

    const updatedJudgeTitleWithFullName = await getJudgeWithTitle({
      applicationContext,
      judgeUserName: newTrialSessionEntity.judgeName,
      shouldReturnFullName: true,
    });

    const trialSessionInformation = {
      caseProcedureType: caseEntity.procedureType,
      chambersPhoneNumber: newTrialSessionEntity.chambersPhoneNumber,
      docketNumber: caseEntity.docketNumber,
      priorJudgeTitleWithFullName,
      proceedingType: newTrialSessionEntity.proceedingType,
      startDate: newTrialSessionEntity.startDate,
      trialLocation: newTrialSessionEntity.trialLocation,
      updatedJudgeTitleWithFullName,
    };

    const notice = await applicationContext
      .getUseCases()
      .generateNoticeOfChangeOfTrialJudgeInteractor(applicationContext, {
        trialSessionInformation,
      });

    const docketEntryId = applicationContext.getUniqueId();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: notice,
      key: docketEntryId,
    });

    const noticeOfChangeToRemoteProceedingDocketEntry = new DocketEntry(
      {
        docketEntryId,
        documentTitle:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge
            .documentTitle,
        documentType:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge
            .documentType,
        eventCode:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge.eventCode,
        isAutoGenerated: true,
        isFileAttached: true,
        isOnDocketRecord: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        userId,
      },
      { applicationContext },
    );

    noticeOfChangeToRemoteProceedingDocketEntry.numberOfPages =
      await applicationContext.getUseCaseHelpers().countPagesInDocument({
        applicationContext,
        docketEntryId:
          noticeOfChangeToRemoteProceedingDocketEntry.docketEntryId,
      });

    caseEntity.addDocketEntry(noticeOfChangeToRemoteProceedingDocketEntry);
    const servedParties = aggregatePartiesForService(caseEntity);

    noticeOfChangeToRemoteProceedingDocketEntry.setAsServed(servedParties.all);

    await serveNoticesForCase(applicationContext, {
      PDFDocument,
      caseEntity,
      newPdfDoc,
      noticeDocketEntryEntity: noticeOfChangeToRemoteProceedingDocketEntry,
      noticeDocumentPdfData: notice,
      servedParties,
    });
  }
};
