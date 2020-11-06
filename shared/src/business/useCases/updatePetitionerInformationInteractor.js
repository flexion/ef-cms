const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const {
  copyToNewPdf,
  getAddressPages,
} = require('../useCaseHelper/service/appendPaperServiceAddressPageToPdf');
const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SERVICE_INDICATOR_TYPES,
} = require('../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { addCoverToPdf } = require('./addCoversheetInteractor');
const { Case } = require('../entities/cases/Case');
const { DOCKET_SECTION } = require('../entities/EntityConstants');
const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');
const { UnauthorizedError } = require('../../errors/errors');
const { WorkItem } = require('../entities/WorkItem');

const createDocketEntryForChange = async ({
  applicationContext,
  caseEntity,
  contactName,
  documentType,
  newData,
  oldData,
  servedParties,
  user,
}) => {
  const caseDetail = caseEntity.validate().toRawObject();
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseDetail);

  const changeOfAddressPdf = await applicationContext
    .getDocumentGenerators()
    .changeOfAddress({
      applicationContext,
      content: {
        caseCaptionExtension,
        caseTitle,
        docketNumber: caseEntity.docketNumber,
        docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
        documentTitle: documentType.title,
        name: contactName,
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
    },
    { applicationContext },
  );
  changeOfAddressDocketEntry.setAsServed(servedParties.all);

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

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: changeOfAddressPdfWithCover,
    key: newDocketEntryId,
  });

  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: changeOfAddressDocketEntry.docketEntryId,
    servedParties,
  });

  return { changeOfAddressDocketEntry, changeOfAddressPdfWithCover };
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

  await applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
    applicationContext,
    workItem: workItem.validate().toRawObject(),
  });
};

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.contactPrimary the primary contact information to update on the case
 * @param {object} providers.contactSecondary the secondary contact information to update on the case
 * @param {object} providers.partyType the party type to update on the case
 * @returns {object} the updated case data
 */
exports.updatePetitionerInformationInteractor = async ({
  applicationContext,
  contactPrimary,
  contactSecondary,
  docketNumber,
  partyType,
}) => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITIONER_INFO)) {
    throw new UnauthorizedError('Unauthorized for editing petition details');
  }

  const primaryEditableFields = {
    address1: contactPrimary.address1,
    address2: contactPrimary.address2,
    address3: contactPrimary.address3,
    city: contactPrimary.city,
    country: contactPrimary.country,
    countryType: contactPrimary.countryType,
    inCareOf: contactPrimary.inCareOf,
    name: contactPrimary.name,
    phone: contactPrimary.phone,
    postalCode: contactPrimary.postalCode,
    secondaryName: contactPrimary.secondaryName,
    serviceIndicator: contactPrimary.serviceIndicator,
    state: contactPrimary.state,
    title: contactPrimary.title,
  };
  let secondaryEditableFields;
  if (contactSecondary) {
    secondaryEditableFields = {
      address1: contactSecondary.address1,
      address2: contactSecondary.address2,
      address3: contactSecondary.address3,
      city: contactSecondary.city,
      country: contactSecondary.country,
      countryType: contactSecondary.countryType,
      inCareOf: contactSecondary.inCareOf,
      name: contactSecondary.name,
      phone: contactSecondary.phone,
      postalCode: contactSecondary.postalCode,
      serviceIndicator: contactSecondary.serviceIndicator,
      state: contactSecondary.state,
    };
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const primaryChange = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData: primaryEditableFields,
      oldData: oldCase.contactPrimary,
    });

  const secondaryChange =
    secondaryEditableFields &&
    secondaryEditableFields.name &&
    oldCase.contactSecondary &&
    oldCase.contactSecondary.name
      ? applicationContext.getUtilities().getDocumentTypeForAddressChange({
          newData: secondaryEditableFields,
          oldData: oldCase.contactSecondary,
        })
      : undefined;

  const caseEntity = new Case(
    {
      ...oldCase,
      contactPrimary: {
        ...oldCase.contactPrimary,
        ...primaryEditableFields,
      },
      contactSecondary: {
        ...oldCase.contactSecondary,
        ...secondaryEditableFields,
      },
      partyType,
    },
    { applicationContext },
  );

  const partyWithPaperService =
    caseEntity.contactPrimary.serviceIndicator ===
      SERVICE_INDICATOR_TYPES.SI_PAPER ||
    (caseEntity.contactSecondary &&
      caseEntity.contactSecondary.serviceIndicator ===
        SERVICE_INDICATOR_TYPES.SI_PAPER) ||
    (caseEntity.privatePractitioners &&
      caseEntity.privatePractitioners.find(
        pp => pp.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
      )) ||
    (caseEntity.irsPractitioners &&
      caseEntity.irsPractitioners.find(
        ip => ip.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
      ));

  const servedParties = aggregatePartiesForService(caseEntity);

  let primaryChangeDocs;
  let secondaryChangeDocs;
  let paperServicePdfUrl;
  if (primaryChange) {
    primaryChangeDocs = await createDocketEntryForChange({
      applicationContext,
      caseEntity,
      contactName: primaryEditableFields.name,
      documentType: primaryChange,
      newData: primaryEditableFields,
      oldData: oldCase.contactPrimary,
      servedParties,
      user,
    });

    const privatePractitionersRepresentingPrimaryContact = caseEntity.privatePractitioners.filter(
      d => d.representingPrimary,
    );
    if (
      privatePractitionersRepresentingPrimaryContact.length === 0 ||
      partyWithPaperService
    ) {
      await createWorkItemForChange({
        applicationContext,
        caseEntity,
        changeOfAddressDocketEntry:
          primaryChangeDocs.changeOfAddressDocketEntry,
        user,
      });
    }
  }
  if (secondaryChange) {
    secondaryChangeDocs = await createDocketEntryForChange({
      applicationContext,
      caseEntity,
      contactName: secondaryEditableFields.name,
      documentType: secondaryChange,
      newData: secondaryEditableFields,
      oldData: oldCase.contactSecondary || {},
      servedParties,
      user,
    });
    const privatePractitionersRepresentingSecondaryContact = caseEntity.privatePractitioners.filter(
      d => d.representingSecondary,
    );
    if (
      privatePractitionersRepresentingSecondaryContact.length === 0 ||
      partyWithPaperService
    ) {
      await createWorkItemForChange({
        applicationContext,
        caseEntity,
        changeOfAddressDocketEntry:
          secondaryChangeDocs.changeOfAddressDocketEntry,
        user,
      });
    }
  }

  if ((primaryChange || secondaryChange) && servedParties.paper.length > 0) {
    const fullDocument = await PDFDocument.create();

    const addressPages = await getAddressPages({
      applicationContext,
      caseEntity,
      servedParties,
    });

    if (primaryChangeDocs && primaryChangeDocs.changeOfAddressPdfWithCover) {
      await copyToNewPdf({
        addressPages,
        applicationContext,
        newPdfDoc: fullDocument,
        noticeDoc: await PDFDocument.load(
          primaryChangeDocs.changeOfAddressPdfWithCover,
        ),
      });
    }
    if (
      secondaryChangeDocs &&
      secondaryChangeDocs.changeOfAddressPdfWithCover
    ) {
      await copyToNewPdf({
        addressPages,
        applicationContext,
        newPdfDoc: fullDocument,
        noticeDoc: await PDFDocument.load(
          secondaryChangeDocs.changeOfAddressPdfWithCover,
        ),
      });
    }

    const paperServicePdfData = await fullDocument.save();
    const paperServicePdfId = applicationContext.getUniqueId();
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: paperServicePdfData,
      key: paperServicePdfId,
      useTempBucket: true,
    });

    const {
      url,
    } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      applicationContext,
      key: paperServicePdfId,
      useTempBucket: true,
    });

    paperServicePdfUrl = url;
  }

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  return {
    paperServiceParties: servedParties.paper,
    paperServicePdfUrl,
    updatedCase,
  };
};
