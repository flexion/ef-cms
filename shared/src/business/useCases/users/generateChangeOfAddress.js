const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  calculateISODate,
  dateStringsCompared,
} = require('../../utilities/DateHandler');
const {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { addCoverToPdf } = require('../addCoversheetInteractor');
const { Case } = require('../../entities/cases/Case');
const { clone } = require('lodash');
const { DocketEntry } = require('../../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { WorkItem } = require('../../entities/WorkItem');

exports.generateChangeOfAddress = async ({
  applicationContext,
  bypassDocketEntry = false,
  contactInfo,
  updatedName,
  user,
}) => {
  const docketNumbers = await applicationContext
    .getPersistenceGateway()
    .getCasesByUserId({
      applicationContext,
      userId: user.userId,
    });

  let completedCases = 0;
  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'user_contact_update_progress',
      completedCases,
      totalCases: docketNumbers.length,
    },
    userId: user.userId,
  });

  const updatedCases = [];

  for (let caseInfo of docketNumbers) {
    try {
      const { docketNumber } = caseInfo;
      const newData = contactInfo;

      const userCase = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      let caseEntity = new Case(userCase, { applicationContext });

      const practitionerName = updatedName || user.name;
      const practitionerObject = caseEntity.privatePractitioners
        .concat(caseEntity.irsPractitioners)
        .find(practitioner => practitioner.userId === user.userId);

      if (!practitionerObject) {
        throw new Error(
          `Could not find user|${user.userId} barNumber: ${user.barNumber} on ${docketNumber}`,
        );
      }

      const oldData = clone(practitionerObject.contact);

      // This updates the case by reference!
      practitionerObject.contact = contactInfo;
      practitionerObject.name = practitionerName;

      // we do this again so that it will convert '' to null
      caseEntity = new Case(caseEntity, { applicationContext });

      const maxClosedDate = calculateISODate({
        howMuch: -6,
        units: 'months',
      });
      const isOpen = caseEntity.status !== CASE_STATUS_TYPES.closed;
      const isRecent =
        caseEntity.closedDate &&
        dateStringsCompared(caseEntity.closedDate, maxClosedDate) >= 0;

      if (!bypassDocketEntry && (isOpen || isRecent)) {
        await generateAndServeDocketEntry({
          applicationContext,
          caseEntity,
          newData,
          oldData,
          practitionerName,
          user,
          userCase,
        });
      }

      const validatedRawCase = caseEntity.validate().toRawObject();
      const updatedCase = await applicationContext
        .getPersistenceGateway()
        .updateCase({
          applicationContext,
          caseToUpdate: validatedRawCase,
        });

      updatedCases.push(updatedCase);
    } catch (error) {
      applicationContext.logger.error(error);
      await applicationContext.notifyHoneybadger(error);
    }

    completedCases++;
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'user_contact_update_progress',
        completedCases,
        totalCases: docketNumbers.length,
      },
      userId: user.userId,
    });
  }

  return updatedCases;
};

/**
 * This function isolates task of generating the Docket Entry in addition to
 * serving it to other parties on the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the instantiated Case class
 * @param {object} providers.newData the new practitioner contact information
 * @param {object} providers.oldData the old practitioner contact information (for comparison)
 * @param {object} providers.practitionerName the name of the practitioner
 * @param {object} providers.user the user object that includes userId, barNumber etc.
 * @param {object} providers.userCase the application context
 * @returns {Promise<User[]>} the internal users
 */
const generateAndServeDocketEntry = async ({
  applicationContext,
  caseEntity,
  newData,
  oldData,
  practitionerName,
  user,
  userCase,
}) => {
  const rawCase = caseEntity.validate().toRawObject();
  const caseDetail = {
    ...rawCase,
  };

  const documentType = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData,
      oldData,
    });

  if (!documentType) return;

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const changeOfAddressPdf = await applicationContext
    .getDocumentGenerators()
    .changeOfAddress({
      applicationContext,
      content: {
        caseCaptionExtension,
        caseTitle,
        docketNumber: caseDetail.docketNumber,
        docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
        documentTitle: documentType.title,
        name: `${practitionerName} (${user.barNumber})`,
        newData,
        oldData,
      },
    });

  const newDocketEntryId = applicationContext.getUniqueId();

  const documentData = {
    addToCoversheet: true,
    additionalInfo: `for ${practitionerName}`,
    docketEntryId: newDocketEntryId,
    docketNumber: caseEntity.docketNumber,
    documentTitle: documentType.title,
    documentType: documentType.title,
    eventCode: documentType.eventCode,
    isAutoGenerated: true,
    isFileAttached: true,
    isOnDocketRecord: true,
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    userId: user.userId,
  };

  if (user.role === ROLES.privatePractitioner) {
    documentData.privatePractitioners = [
      {
        name: practitionerName,
      },
    ];
  } else if (user.role === ROLES.irsPractitioner) {
    documentData.partyIrsPractitioner = true;
  }

  const changeOfAddressDocketEntry = new DocketEntry(documentData, {
    applicationContext,
  });

  const servedParties = aggregatePartiesForService(caseEntity);
  changeOfAddressDocketEntry.setAsServed(servedParties.all);

  caseEntity.addDocketEntry(changeOfAddressDocketEntry);

  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: changeOfAddressDocketEntry.docketEntryId,
    servedParties,
  });

  const paperServiceRequested =
    userCase.contactPrimary.serviceIndicator ===
      SERVICE_INDICATOR_TYPES.SI_PAPER ||
    (userCase.contactSecondary &&
      userCase.contactSecondary.serviceIndicator ===
        SERVICE_INDICATOR_TYPES.SI_PAPER) ||
    user.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER;

  let workItem = null;

  if (paperServiceRequested) {
    workItem = new WorkItem(
      {
        assigneeId: null,
        assigneeName: null,
        associatedJudge: caseEntity.associatedJudge,
        caseIsInProgress: caseEntity.inProgress,
        caseStatus: caseEntity.status,
        caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
        docketEntry: {
          ...changeOfAddressDocketEntry.toRawObject(),
          createdAt: changeOfAddressDocketEntry.createdAt,
        },
        docketNumber: caseEntity.docketNumber,
        docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
        section: DOCKET_SECTION,
        sentBy: user.name,
        sentByUserId: user.userId,
      },
      { applicationContext },
    );

    changeOfAddressDocketEntry.setWorkItem(workItem);
  }

  const { pdfData: changeOfAddressPdfWithCover } = await addCoverToPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity: changeOfAddressDocketEntry,
    pdfData: changeOfAddressPdf,
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: changeOfAddressPdfWithCover,
    key: newDocketEntryId,
  });

  changeOfAddressDocketEntry.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId: changeOfAddressDocketEntry.docketEntryId,
    });

  if (workItem) {
    await applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
      applicationContext,
      workItem: workItem.validate().toRawObject(),
    });
  }

  caseEntity.updateDocketEntry(changeOfAddressDocketEntry);
};
