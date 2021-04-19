const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const {
  copyToNewPdf,
  getAddressPages,
} = require('../useCaseHelper/service/appendPaperServiceAddressPageToPdf');
const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { addCoverToPdf } = require('./addCoversheetInteractor');
const { Case, getContactPrimary } = require('../entities/cases/Case');
const { defaults, pick } = require('lodash');
const { DOCKET_SECTION } = require('../entities/EntityConstants');
const { DocketEntry } = require('../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../utilities/getCaseCaptionMeta');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
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

  await applicationContext
    .getPersistenceGateway()
    .saveWorkItemAndAddToSectionInbox({
      applicationContext,
      workItem: workItem.validate().toRawObject(),
    });
};

const generatePaperServicePdf = async ({
  applicationContext,
  caseEntity,
  servedParties,
  primaryChangeDocs = {},
  secondaryChangeDocs = {},
}) => {
  const { PDFDocument } = await applicationContext.getPdfLib();
  const fullDocument = await PDFDocument.create();
  const addressPages = await getAddressPages({
    applicationContext,
    caseEntity,
    servedParties,
  });

  for (const changeDocs of [primaryChangeDocs, secondaryChangeDocs]) {
    if (changeDocs && changeDocs.changeOfAddressPdfWithCover) {
      await copyToNewPdf({
        addressPages,
        applicationContext,
        newPdfDoc: fullDocument,
        noticeDoc: await PDFDocument.load(
          changeDocs.changeOfAddressPdfWithCover,
        ),
      });
    }
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
  return url;
};

const createDocketEntryAndWorkItem = async ({
  applicationContext,
  caseEntity,
  change,
  editableFields,
  oldCaseContact,
  partyWithPaperService,
  privatePractitionersRepresentingContact,
  servedParties,
  user,
}) => {
  const changeDocs = await createDocketEntryForChange({
    applicationContext,
    caseEntity,
    contactName: editableFields.name,
    documentType: change,
    newData: editableFields,
    oldData: oldCaseContact,
    servedParties,
    user,
  });

  if (!privatePractitionersRepresentingContact || partyWithPaperService) {
    await createWorkItemForChange({
      applicationContext,
      caseEntity,
      changeOfAddressDocketEntry: changeDocs.changeOfAddressDocketEntry,
      user,
    });
  }
  return changeDocs;
};

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.contactPrimary the primary contact information to update on the case
 * @param {object} providers.contactSecondary the secondary contact information to update on the case
 * @param {object} providers.partyType the party type to update on the case
 * @returns {object} the updated case data
 */
exports.updatePetitionerInformationInteractor = async (
  applicationContext,
  { contactPrimary, contactSecondary, docketNumber, partyType },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITIONER_INFO)) {
    throw new UnauthorizedError('Unauthorized for editing petition details');
  }

  const primaryEditableFields = pick(
    defaults(contactPrimary, {
      address2: undefined,
      address3: undefined,
      secondaryName: undefined,
      title: undefined,
    }),
    [
      'address1',
      'address2',
      'address3',
      'city',
      'country',
      'countryType',
      'inCareOf',
      'name',
      'phone',
      'postalCode',
      'secondaryName',
      'serviceIndicator',
      'state',
      'title',
    ],
  );

  let secondaryEditableFields;
  if (contactSecondary) {
    secondaryEditableFields = pick(
      defaults(contactSecondary, { address2: undefined, address3: undefined }),
      [
        'address1',
        'address2',
        'address3',
        'city',
        'country',
        'countryType',
        'inCareOf',
        'name',
        'phone',
        'postalCode',
        'serviceIndicator',
        'state',
      ],
    );
  }

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const primaryChange = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData: primaryEditableFields,
      oldData: getContactPrimary(oldCase),
    });

  const caseToUpdateContacts = new Case(
    {
      ...oldCase,
      partyType,
    },
    { applicationContext },
  );

  const oldCaseContactPrimary = caseToUpdateContacts.getContactPrimary();
  try {
    caseToUpdateContacts.updatePetitioner({
      ...oldCaseContactPrimary,
      ...primaryEditableFields,
    });
  } catch (e) {
    applicationContext.logger.info('no contact primary was found on the case');
    throw new NotFoundError(e.message);
  }

  const oldCaseContactSecondary = caseToUpdateContacts.getContactSecondary();
  const secondaryChange =
    secondaryEditableFields &&
    secondaryEditableFields.name &&
    oldCaseContactSecondary &&
    oldCaseContactSecondary.name
      ? applicationContext.getUtilities().getDocumentTypeForAddressChange({
          newData: secondaryEditableFields,
          oldData: oldCaseContactSecondary,
        })
      : undefined;

  if (contactSecondary) {
    try {
      caseToUpdateContacts.updatePetitioner({
        additionalName: oldCaseContactSecondary?.additionalName,
        contactId: oldCaseContactSecondary?.contactId,
        contactType: oldCaseContactSecondary?.contactType,
        email: oldCaseContactSecondary?.email,
        hasEAccess: oldCaseContactSecondary?.hasEAccess,
        isAddressSealed: oldCaseContactSecondary?.isAddressSealed,
        sealedAndUnavailable: oldCaseContactSecondary?.sealedAndUnavailable,
        secondaryName: oldCaseContactSecondary?.secondaryName,
        title: oldCaseContactSecondary?.title,
        ...secondaryEditableFields,
      });
    } catch (e) {
      applicationContext.logger.info(
        'no contact secondary was found on the case',
      );
      throw new NotFoundError(e.message);
    }
  }

  //send back through the constructor so the contacts are created with the contact constructor
  let caseEntity = new Case(
    {
      ...caseToUpdateContacts.toRawObject(),
    },
    { applicationContext },
  ).validate();

  const servedParties = aggregatePartiesForService(caseEntity);

  let primaryChangeDocs;
  let secondaryChangeDocs;
  let paperServicePdfUrl;
  const newContactPrimary = caseEntity.getContactPrimary();
  const newContactSecondary = caseEntity.getContactSecondary();

  if (
    (primaryChange && !newContactPrimary.isAddressSealed) ||
    (secondaryChange && !newContactSecondary.isAddressSealed)
  ) {
    const partyWithPaperService = caseEntity.hasPartyWithPaperService();

    if (primaryChange) {
      const privatePractitionersRepresentingContact = caseEntity.privatePractitioners.some(
        privatePractitioner =>
          privatePractitioner.getRepresentingPrimary(caseEntity),
      );

      primaryChangeDocs = await createDocketEntryAndWorkItem({
        applicationContext,
        caseEntity,
        change: primaryChange,
        editableFields: primaryEditableFields,
        oldCaseContact: oldCaseContactPrimary,
        partyWithPaperService,
        privatePractitionersRepresentingContact,
        servedParties,
        user,
      });
    }

    if (secondaryChange) {
      const privatePractitionersRepresentingContact = caseEntity.privatePractitioners.some(
        privatePractitioner =>
          privatePractitioner.getRepresentingSecondary(caseEntity),
      );

      secondaryChangeDocs = await createDocketEntryAndWorkItem({
        applicationContext,
        caseEntity,
        change: secondaryChange,
        editableFields: secondaryEditableFields,
        oldCaseContact: oldCaseContactSecondary,
        partyWithPaperService,
        privatePractitionersRepresentingContact,
        servedParties,
        user,
      });
    }

    if (servedParties.paper.length > 0) {
      paperServicePdfUrl = await generatePaperServicePdf({
        applicationContext,
        caseEntity,
        primaryChangeDocs,
        secondaryChangeDocs,
        servedParties,
      });
    }
  }

  if (
    contactPrimary.email &&
    contactPrimary.email !== oldCaseContactPrimary.email
  ) {
    const isEmailAvailable = await applicationContext
      .getPersistenceGateway()
      .isEmailAvailable({
        applicationContext,
        email: contactPrimary.email,
      });

    if (isEmailAvailable) {
      caseEntity = await applicationContext
        .getUseCaseHelpers()
        .createUserForContactPrimary({
          applicationContext,
          caseEntity,
          email: contactPrimary.email,
          name: contactPrimary.name,
        });
    } else {
      caseEntity = await applicationContext
        .getUseCaseHelpers()
        .addExistingUserToCase({
          applicationContext,
          caseEntity,
          email: contactPrimary.email,
          name: contactPrimary.name,
        });
    }
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return {
    paperServiceParties: servedParties.paper,
    paperServicePdfUrl,
    updatedCase,
  };
};
