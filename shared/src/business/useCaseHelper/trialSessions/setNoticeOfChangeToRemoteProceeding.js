const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../entities/EntityConstants');
const { DocketEntry } = require('../../entities/DocketEntry');

/**
 * setNoticeOfChangeToRemoteProceeding
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseEntity the case data
 * @param {object} providers.currentTrialSession the old trial session data
 * @param {object} providers.newPdfDoc the new PDF contents to be appended
 * @param {object} providers.newTrialSessionEntity the new trial session data
 * @param {object} providers.userId the user ID
 * @returns {Promise<void>} the created trial session
 */
exports.setNoticeOfChangeToRemoteProceeding = async (
  applicationContext,
  { caseEntity, newPdfDoc, newTrialSessionEntity, userId },
) => {
  const trialSessionInformation = {
    chambersPhoneNumber: newTrialSessionEntity.chambersPhoneNumber,
    joinPhoneNumber: newTrialSessionEntity.joinPhoneNumber,
    judgeName: newTrialSessionEntity.judge.name,
    meetingId: newTrialSessionEntity.meetingId,
    password: newTrialSessionEntity.password,
    startDate: newTrialSessionEntity.startDate,
    startTime: newTrialSessionEntity.startTime,
    trialLocation: newTrialSessionEntity.trialLocation,
  };

  const notice = await applicationContext
    .getUseCases()
    .generateNoticeOfChangeToRemoteProceedingInteractor(applicationContext, {
      docketNumber: caseEntity.docketNumber,
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
      date: newTrialSessionEntity.startDate,
      docketEntryId,
      documentTitle:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToRemoteProceeding
          .documentTitle,
      documentType:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToRemoteProceeding
          .documentType,
      eventCode:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToRemoteProceeding
          .eventCode,
      isAutoGenerated: true,
      isFileAttached: true,
      isOnDocketRecord: true,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      signedAt: applicationContext.getUtilities().createISODateString(),
      trialLocation: newTrialSessionEntity.trialLocation,
      userId,
    },
    { applicationContext },
  );

  noticeOfChangeToRemoteProceedingDocketEntry.numberOfPages =
    await applicationContext.getUseCaseHelpers().countPagesInDocument({
      applicationContext,
      docketEntryId: noticeOfChangeToRemoteProceedingDocketEntry.docketEntryId,
    });

  caseEntity.addDocketEntry(noticeOfChangeToRemoteProceedingDocketEntry);
  const servedParties = aggregatePartiesForService(caseEntity);

  noticeOfChangeToRemoteProceedingDocketEntry.setAsServed(servedParties.all);

  await applicationContext.getUseCaseHelpers().serveGeneratedNoticesOnCase({
    applicationContext,
    caseEntity,
    newPdfDoc,
    noticeDocketEntryEntity: noticeOfChangeToRemoteProceedingDocketEntry,
    noticeDocumentPdfData: notice,
    servedParties,
  });
};
