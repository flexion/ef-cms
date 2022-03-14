const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { addCoverToPdf } = require('../../useCases/addCoversheetInteractor');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
const { DocketEntry } = require('../../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');

const { WorkItem } = require('../../entities/WorkItem');

/**
 * This function isolates task of generating the Docket Entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the instantiated Case class (updated by reference)
 * @param {object} providers.documentType the document type of the document being created
 * @param {object} providers.newData the new contact information
 * @param {object} providers.oldData the old contact information (for comparison)
 * @param {object} providers.user the user object that includes userId, barNumber etc.
 * @returns {Promise<User[]>} the internal users
 */
const createDocketEntryForChange = async ({
  applicationContext,
  caseEntity,
  documentType,
  docketMeta = {},
  newData,
  oldData,
  servedParties,
  user,
}) => {
  const caseDetail = caseEntity.validate().toRawObject();
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);
  let changeOfAddressPdfName = newData.name;
  let contactName = newData.name;

  // should only be true when called via generateChangeOfAddress
  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner
  ) {
    changeOfAddressPdfName = changeOfAddressPdfName + ` (${user.barNumber})`;
    contactName = newData.name;
  }

  const changeOfAddressPdf = await applicationContext
    .getDocumentGenerators()
    .changeOfAddress({
      applicationContext,
      content: {
        caseCaptionExtension,
        caseTitle,
        docketNumber: caseEntity.docketNumber,
        docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
        documentType,
        name: changeOfAddressPdfName,
        newData,
        oldData,
      },
    });

  const newDocketEntryId = applicationContext.getUniqueId();

  const changeOfAddressDocketEntry = new DocketEntry(
    {
      addToCoversheet: true,
      additionalInfo: `for ${contactName}`,
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
      ...docketMeta,
    },
    { applicationContext },
  );

  const { pdfData: changeOfAddressPdfWithCover } = await addCoverToPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity: changeOfAddressDocketEntry,
    pdfData: changeOfAddressPdf,
  });

  changeOfAddressDocketEntry.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      documentBytes: changeOfAddressPdfWithCover,
    });

  caseEntity.addDocketEntry(changeOfAddressDocketEntry);
  changeOfAddressDocketEntry.setAsServed(servedParties.all);
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: changeOfAddressPdfWithCover,
    key: newDocketEntryId,
  });
  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      key: newDocketEntryId,
    });

  return {
    changeOfAddressDocketEntry,
    changeOfAddressPdfWithCover,
    servedParties,
    url,
  };
};

const createWorkItemForChange = async ({
  applicationContext,
  caseEntity,
  changeOfAddressDocketEntry,
  user,
}) => {
  const workItem = new WorkItem(
    {
      assigneeId: null,
      assigneeName: null,
      associatedJudge: caseEntity.associatedJudge,
      caseStatus: caseEntity.status,
      caseTitle: Case.getCaseTitle(caseEntity.caseCaption),
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

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: workItem.validate().toRawObject(),
  });
};

const generateAndServeDocketEntry = async ({
  applicationContext,
  barNumber,
  caseEntity,
  contactName,
  docketMeta,
  documentType,
  newData,
  oldData,
  privatePractitionersRepresentingContact,
  servedParties,
  user,
}) => {
  const partyWithPaperService = caseEntity.hasPartyWithServiceType(
    SERVICE_INDICATOR_TYPES.SI_PAPER,
  );

  const paperServiceRequested =
    partyWithPaperService ||
    user.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER;

  let shouldCreateWorkItem;

  if (
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.privatePractitioner
  ) {
    shouldCreateWorkItem = paperServiceRequested;
  } else {
    if (paperServiceRequested || !privatePractitionersRepresentingContact) {
      shouldCreateWorkItem = true;
    }
  }

  let changeOfAddressDocketEntry;
  let url;
  ({ changeOfAddressDocketEntry, url } = await createDocketEntryForChange({
    applicationContext,
    barNumber,
    caseEntity,
    contactName,
    docketMeta,
    documentType,
    newData,
    oldData,
    servedParties,
    user,
  }));

  if (shouldCreateWorkItem) {
    await createWorkItemForChange({
      applicationContext,
      caseEntity,
      changeOfAddressDocketEntry,
      user,
    });
  }
  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: changeOfAddressDocketEntry.docketEntryId,
    servedParties,
  });

  return { caseEntity, changeOfAddressDocketEntry, url };
};

module.exports = {
  createDocketEntryForChange,
  createWorkItemForChange,
  generateAndServeDocketEntry,
};
