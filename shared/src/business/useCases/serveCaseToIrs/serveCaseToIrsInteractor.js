const {
  formatNow,
  FORMATS,
  getBusinessDateInFuture,
} = require('../../utilities/DateHandler');
const {
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_MAP,
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { getClinicLetterKey } = require('../../utilities/getClinicLetterKey');
const { PETITIONS_SECTION } = require('../../entities/EntityConstants');
const { remove } = require('lodash');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const { UnauthorizedError } = require('../../../errors/errors');

const addDocketEntryForPaymentStatus = ({
  applicationContext,
  caseEntity,
  user,
}) => {
  if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.PAID) {
    caseEntity.addDocketEntry(
      new DocketEntry(
        {
          documentTitle: 'Filing Fee Paid',
          documentType: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
          eventCode: MINUTE_ENTRIES_MAP.filingFeePaid.eventCode,
          filingDate: caseEntity.petitionPaymentDate,
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
          userId: user.userId,
        },
        { applicationContext },
      ),
    );
  } else if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.WAIVED) {
    caseEntity.addDocketEntry(
      new DocketEntry(
        {
          documentTitle: 'Filing Fee Waived',
          documentType: MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
          eventCode: MINUTE_ENTRIES_MAP.filingFeeWaived.eventCode,
          filingDate: caseEntity.petitionPaymentWaivedDate,
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
          userId: user.userId,
        },
        { applicationContext },
      ),
    );
  }
};

const addDocketEntries = ({ caseEntity }) => {
  const initialDocumentTypesListRequiringDocketEntry = Object.values(
    INITIAL_DOCUMENT_TYPES_MAP,
  );

  remove(
    initialDocumentTypesListRequiringDocketEntry,
    doc =>
      doc === INITIAL_DOCUMENT_TYPES.petition.documentType ||
      doc === INITIAL_DOCUMENT_TYPES.stin.documentType,
  );

  for (let documentType of initialDocumentTypesListRequiringDocketEntry) {
    const foundDocketEntry = caseEntity.docketEntries.find(
      caseDocument => caseDocument.documentType === documentType,
    );

    if (foundDocketEntry) {
      foundDocketEntry.isOnDocketRecord = true;
      caseEntity.updateDocketEntry(foundDocketEntry);
    }
  }
};

const createPetitionWorkItems = async ({
  applicationContext,
  caseEntity,
  user,
}) => {
  const petitionDocument = caseEntity.docketEntries.find(
    doc => doc.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
  );
  const initializeCaseWorkItem = petitionDocument.workItem;

  initializeCaseWorkItem.docketEntry.servedAt = petitionDocument.servedAt;
  initializeCaseWorkItem.caseTitle = Case.getCaseTitle(caseEntity.caseCaption);
  initializeCaseWorkItem.docketNumberWithSuffix =
    caseEntity.docketNumberWithSuffix;

  initializeCaseWorkItem.setAsCompleted({
    message: 'Served to IRS',
    user,
  });

  await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
    applicationContext,
    section: PETITIONS_SECTION,
    userId: user.userId,
    workItem: initializeCaseWorkItem.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: initializeCaseWorkItem.validate().toRawObject(),
  });
};

const generateNoticeOfReceipt = async ({ applicationContext, caseEntity }) => {
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const {
    docketNumberWithSuffix,
    preferredTrialCity,
    procedureType,
    receivedAt,
  } = caseEntity;

  let primaryContactNotrPdfData = await applicationContext
    .getDocumentGenerators()
    .noticeOfReceiptOfPetition({
      applicationContext,
      data: {
        address: caseEntity.petitioners[0],
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        preferredTrialCity,
        receivedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(receivedAt, 'MONTH_DAY_YEAR'),
        servedDate: applicationContext
          .getUtilities()
          .formatDateString(caseEntity.getIrsSendDate(), 'MONTH_DAY_YEAR'),
      },
    });

  let secondaryContactNotrPdfData;
  const contactSecondary = caseEntity.petitioners[1];
  // caseEntity.getContactSecondary()
  const addressesAreDifferent = await contactAddressesAreDifferent({
    applicationContext,
    caseEntity,
  });
  if (contactSecondary && addressesAreDifferent) {
    secondaryContactNotrPdfData = await applicationContext
      .getDocumentGenerators()
      .noticeOfReceiptOfPetition({
        applicationContext,
        data: {
          address: contactSecondary,
          caseCaptionExtension,
          caseTitle,
          docketNumberWithSuffix,
          preferredTrialCity,
          receivedAtFormatted: applicationContext
            .getUtilities()
            .formatDateString(receivedAt, 'MONTH_DAY_YEAR'),
          servedDate: applicationContext
            .getUtilities()
            .formatDateString(caseEntity.getIrsSendDate(), 'MONTH_DAY_YEAR'),
        },
      });
  }

  let clinicLetter;
  const isPrimaryContactProSe =
    caseEntity.getPractitionersRepresenting(
      caseEntity.getContactPrimary().contactId,
    ).length === 0;
  const isSecondaryContactProSe =
    !!caseEntity.getContactSecondary() &&
    caseEntity.getPractitionersRepresenting(
      caseEntity.getContactSecondary().contactId,
    ).length === 0;

  if (
    shouldIncludeClinicalLetter(
      preferredTrialCity,
      isPrimaryContactProSe,
      contactSecondary,
      addressesAreDifferent,
      isSecondaryContactProSe,
    )
  ) {
    const clinicLetterKey = getClinicLetterKey({
      procedureType,
      trialLocation: preferredTrialCity,
    });

    const doesClinicLetterExist = await applicationContext
      .getPersistenceGateway()
      .isFileExists({
        applicationContext,
        key: clinicLetterKey,
      });

    if (doesClinicLetterExist) {
      clinicLetter = await applicationContext
        .getPersistenceGateway()
        .getDocument({
          applicationContext,
          key: clinicLetterKey,
          protocol: 'S3',
          useTempBucket: false,
        });
    }
  }

  if (clinicLetter && isPrimaryContactProSe) {
    primaryContactNotrPdfData = await applicationContext
      .getUtilities()
      .combineTwoPdfs({
        applicationContext,
        firstPdf: primaryContactNotrPdfData,
        secondPdf: clinicLetter,
      });
  }

  if (clinicLetter && secondaryContactNotrPdfData && isSecondaryContactProSe) {
    secondaryContactNotrPdfData = await applicationContext
      .getUtilities()
      .combineTwoPdfs({
        applicationContext,
        firstPdf: primaryContactNotrPdfData,
        secondPdf: clinicLetter,
      });
  }

  let combinedNotrPdfData = primaryContactNotrPdfData;
  if (secondaryContactNotrPdfData) {
    combinedNotrPdfData = await applicationContext
      .getUtilities()
      .combineTwoPdfs({
        applicationContext,
        firstPdf: primaryContactNotrPdfData,
        secondPdf: secondaryContactNotrPdfData,
      });
  }

  const caseConfirmationPdfName =
    caseEntity.getCaseConfirmationGeneratedPdfFileName();

  await applicationContext.getUtilities().uploadToS3({
    applicationContext,
    caseConfirmationPdfName,
    pdfData: Buffer.from(combinedNotrPdfData),
  });

  let urlToReturn;

  if (caseEntity.isPaper) {
    ({ url: urlToReturn } = await applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl({
        applicationContext,
        key: caseConfirmationPdfName,
        useTempBucket: false,
      }));
  }

  return urlToReturn;
};

const shouldIncludeClinicalLetter = (
  preferredTrialCity,
  isPrimaryContactProSe,
  contactSecondary,
  addressesAreDifferent,
  isSecondaryContactProSe,
) => {
  const primaryIsProSe_And_NoSecondary =
    isPrimaryContactProSe && !contactSecondary;

  const primaryIsProSe_And_SecondaryExists_And_SameAddress_SecondaryIsProSe =
    isPrimaryContactProSe &&
    contactSecondary &&
    !addressesAreDifferent &&
    isSecondaryContactProSe;

  const primaryIsProSe_And_SecondaryExists_And_DifferentAddress =
    isPrimaryContactProSe && contactSecondary && addressesAreDifferent; //it doesn't matter whether the secondary is pro se or not, as long as the primary is pro se and we have different addresses

  const primaryNotProSe_And_SecondaryExists_And_DifferentAddress_And_SecondaryIsProSe =
    !isPrimaryContactProSe &&
    contactSecondary &&
    addressesAreDifferent &&
    isSecondaryContactProSe;

  return (
    preferredTrialCity &&
    (primaryIsProSe_And_NoSecondary ||
      primaryIsProSe_And_SecondaryExists_And_SameAddress_SecondaryIsProSe ||
      primaryIsProSe_And_SecondaryExists_And_DifferentAddress ||
      primaryNotProSe_And_SecondaryExists_And_DifferentAddress_And_SecondaryIsProSe)
  );
};

const createCoversheetsForServedEntries = async ({
  applicationContext,
  caseEntity,
}) => {
  for (const doc of caseEntity.docketEntries) {
    if (doc.isFileAttached) {
      const updatedDocketEntry = await applicationContext
        .getUseCases()
        .addCoversheetInteractor(applicationContext, {
          caseEntity,
          docketEntryId: doc.docketEntryId,
          docketNumber: caseEntity.docketNumber,
          replaceCoversheet: !caseEntity.isPaper,
          useInitialData: !caseEntity.isPaper,
        });

      caseEntity.updateDocketEntry(updatedDocketEntry);
    }
  }
};

const contactAddressesAreDifferent = async ({
  applicationContext,
  caseEntity,
}) => {
  const contactSecondary = caseEntity.getContactSecondary();

  if (!contactSecondary) {
    return false;
  }

  const contactInformationDiff = applicationContext
    .getUtilities()
    .getAddressPhoneDiff({
      newData: caseEntity.getContactPrimary(),
      oldData: contactSecondary,
    });

  const addressFields = [
    'country',
    'countryType',
    'address1',
    'address2',
    'address3',
    'city',
    'state',
    'postalCode',
  ];

  return Object.keys(contactInformationDiff).some(field =>
    addressFields.includes(field),
  );
};

// const generateNotrForSecondaryContactIfDifferent = async ({
//   applicationContext,
//   caseCaptionExtension,
//   caseEntity,
//   caseTitle,
//   contactSecondary,
//   docketNumberWithSuffix,
//   preferredTrialCity,
//   receivedAt,
// }) => {
//   const contactInformationDiff = applicationContext
//     .getUtilities()
//     .getAddressPhoneDiff({
//       newData: caseEntity.petitioners[0],
//       oldData: contactSecondary,
//     });
//
//   const addressFields = [
//     'country',
//     'countryType',
//     'address1',
//     'address2',
//     'address3',
//     'city',
//     'state',
//     'postalCode',
//   ];
//
//   const contactAddressesAreDifferent = Object.keys(contactInformationDiff).some(
//     field => addressFields.includes(field),
//   );
//
//   if (!contactAddressesAreDifferent) {
//     return;
//   }
//
//   const secondaryPdfData = await applicationContext
//     .getDocumentGenerators()
//     .noticeOfReceiptOfPetition({
//       applicationContext,
//       data: {
//         address: contactSecondary,
//         caseCaptionExtension,
//         caseTitle,
//         docketNumberWithSuffix,
//         preferredTrialCity,
//         receivedAtFormatted: applicationContext
//           .getUtilities()
//           .formatDateString(receivedAt, 'MONTH_DAY_YEAR'),
//         servedDate: applicationContext
//           .getUtilities()
//           .formatDateString(caseEntity.getIrsSendDate(), 'MONTH_DAY_YEAR'),
//       },
//     });
//
//   return secondaryPdfData;
// };

/**
 * serveCaseToIrsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Buffer} paper service pdf if the case is a paper case
 */
const serveCaseToIrsInteractor = async (
  applicationContext,
  { docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SERVE_PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity = new Case(caseToBatch, { applicationContext });

  caseEntity.markAsSentToIRS();

  if (caseEntity.isPaper) {
    addDocketEntries({ caseEntity });
  }

  for (const initialDocumentTypeKey of Object.keys(INITIAL_DOCUMENT_TYPES)) {
    await applicationContext.getUtilities().serveCaseDocument({
      applicationContext,
      caseEntity,
      initialDocumentTypeKey,
    });
  }

  addDocketEntryForPaymentStatus({
    applicationContext,
    caseEntity,
    user,
  });

  caseEntity
    .updateCaseCaptionDocketRecord({ applicationContext })
    .updateDocketNumberRecord({ applicationContext })
    .validate();

  if (caseEntity.noticeOfAttachments) {
    const { noticeOfAttachmentsInNatureOfEvidence } =
      SYSTEM_GENERATED_DOCUMENT_TYPES;

    await applicationContext
      .getUseCaseHelpers()
      .addDocketEntryForSystemGeneratedOrder({
        applicationContext,
        caseEntity,
        systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
      });
  }

  if (caseEntity.orderForFilingFee) {
    const { orderForFilingFee } = SYSTEM_GENERATED_DOCUMENT_TYPES;

    const todayPlus60 = getBusinessDateInFuture({
      numberOfDays: 60,
      startDate: formatNow(FORMATS.ISO),
    });

    const content = replaceBracketed(
      orderForFilingFee.content,
      todayPlus60,
      todayPlus60, // since there are 2 instances of the date, replace a 2nd time
    );

    await applicationContext
      .getUseCaseHelpers()
      .addDocketEntryForSystemGeneratedOrder({
        applicationContext,
        caseEntity,
        systemGeneratedDocument: {
          ...orderForFilingFee,
          content,
        },
      });
  }

  await createPetitionWorkItems({
    applicationContext,
    caseEntity,
    user,
  });

  await createCoversheetsForServedEntries({
    applicationContext,
    caseEntity,
  });

  const urlToReturn = await generateNoticeOfReceipt({
    applicationContext,
    caseEntity,
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });

  return urlToReturn;
};

module.exports = {
  addDocketEntryForPaymentStatus,
  serveCaseToIrsInteractor,
};
