const joi = require('@hapi/joi');
const {
  CASE_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PROCEDURE_TYPES,
} = require('../EntityConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { Case } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');
const { Statistic } = require('../Statistic');

/**
 * CaseInternal Entity
 * Represents a Case with required documents that a Petitions Clerk is attempting to add to the system.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function CaseInternal(rawCase, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.applicationForWaiverOfFilingFeeFile =
    rawCase.applicationForWaiverOfFilingFeeFile;
  this.applicationForWaiverOfFilingFeeFileSize =
    rawCase.applicationForWaiverOfFilingFeeFileSize;
  this.caseCaption = rawCase.caseCaption;
  this.caseType = rawCase.caseType;
  this.filingType = rawCase.filingType;
  this.irsNoticeDate = rawCase.irsNoticeDate;
  this.hasVerifiedIrsNotice = rawCase.hasVerifiedIrsNotice || false;
  this.mailingDate = rawCase.mailingDate;
  this.noticeOfAttachments = rawCase.noticeOfAttachments;
  this.orderDesignatingPlaceOfTrial = rawCase.orderDesignatingPlaceOfTrial;
  // this is so the validation that is checking for existence of 3 different fields
  // will work correctly
  if (this.orderDesignatingPlaceOfTrial === false) {
    this.orderDesignatingPlaceOfTrial = undefined;
  }
  this.orderForOds = rawCase.orderForOds;
  this.orderForAmendedPetition = rawCase.orderForAmendedPetition;
  this.orderForAmendedPetitionAndFilingFee =
    rawCase.orderForAmendedPetitionAndFilingFee;
  this.orderForFilingFee = rawCase.orderForFilingFee;
  this.orderForRatification = rawCase.orderForRatification;
  this.orderToShowCause = rawCase.orderToShowCause;
  this.ownershipDisclosureFile = rawCase.ownershipDisclosureFile;
  this.ownershipDisclosureFileSize = rawCase.ownershipDisclosureFileSize;
  this.partyType = rawCase.partyType;
  this.petitionFile = rawCase.petitionFile;
  this.petitionFileSize = rawCase.petitionFileSize;
  this.petitionPaymentDate = rawCase.petitionPaymentDate;
  this.petitionPaymentMethod = rawCase.petitionPaymentMethod;
  this.petitionPaymentStatus = rawCase.petitionPaymentStatus;
  this.petitionPaymentWaivedDate = rawCase.petitionPaymentWaivedDate;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;
  this.receivedAt = rawCase.receivedAt;
  this.requestForPlaceOfTrialFile = rawCase.requestForPlaceOfTrialFile;
  this.requestForPlaceOfTrialFileSize = rawCase.requestForPlaceOfTrialFileSize;
  this.stinFile = rawCase.stinFile;
  this.stinFileSize = rawCase.stinFileSize;
  this.useSameAsPrimary = rawCase.useSameAsPrimary;

  this.statistics = Array.isArray(rawCase.statistics)
    ? rawCase.statistics.map(
        statistic => new Statistic(statistic, { applicationContext }),
      )
    : [];

  const contacts = ContactFactory.createContacts({
    contactInfo: {
      primary: rawCase.contactPrimary,
      secondary: rawCase.contactSecondary,
    },
    isPaper: true,
    partyType: rawCase.partyType,
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
}

CaseInternal.VALIDATION_ERROR_MESSAGES = {
  ...Case.VALIDATION_ERROR_MESSAGES,
  applicationForWaiverOfFilingFeeFile:
    'Upload or scan an Application for Waiver of Filing Fee (APW)',
  chooseAtLeastOneValue:
    'Select trial location and upload/scan RQT or check Order Designating Place of Trial',
  ownershipDisclosureFile: 'Upload or scan Ownership Disclosure Statement(ODS)',
  petitionFile: 'Upload or scan a Petition',
  petitionPaymentDate: [
    {
      contains: 'must be less than or equal to',
      message: 'Payment date cannot be in the future. Enter a valid date.',
    },
    'Enter a valid payment date',
  ],
  petitionPaymentStatus: 'Select a filing fee option',
  preferredTrialCity: 'Select a preferred trial location',
  requestForPlaceOfTrialFile:
    'Upload or scan a Request for Place of Trial (RQT)',
};

const paperRequirements = joi
  .object()
  .keys({
    applicationForWaiverOfFilingFeeFile: joi
      .object()
      .when('petitionPaymentStatus', {
        is: PAYMENT_STATUS.WAIVED,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
    applicationForWaiverOfFilingFeeFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
      'applicationForWaiverOfFilingFeeFile',
      {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      },
    ),
    caseCaption: joi.string().max(500).required(),
    caseType: joi
      .string()
      .valid(...CASE_TYPES)
      .required(),
    hasVerifiedIrsNotice: joi.boolean().required(),
    irsNoticeDate: Case.VALIDATION_RULES.irsNoticeDate,
    mailingDate: joi.string().max(25).required(),
    noticeOfAttachments: Case.VALIDATION_RULES.noticeOfAttachments,
    orderDesignatingPlaceOfTrial:
      Case.VALIDATION_RULES.orderDesignatingPlaceOfTrial,
    orderForAmendedPetition: Case.VALIDATION_RULES.orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee:
      Case.VALIDATION_RULES.orderForAmendedPetitionAndFilingFee,
    orderForFilingFee: Case.VALIDATION_RULES.orderForFilingFee,
    orderForOds: Case.VALIDATION_RULES.orderForOds,
    orderForRatification: Case.VALIDATION_RULES.orderForRatification,
    orderToShowCause: Case.VALIDATION_RULES.orderToShowCause,
    ownershipDisclosureFile: joi.object().when('partyType', {
      is: joi
        .exist()
        .valid(
          PARTY_TYPES.corporation,
          PARTY_TYPES.partnershipAsTaxMattersPartner,
          PARTY_TYPES.partnershipBBA,
          PARTY_TYPES.partnershipOtherThanTaxMatters,
        ),
      otherwise: joi.optional().allow(null),
      then: joi.when('orderForOds', {
        is: joi.not(true),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      }),
    }),
    ownershipDisclosureFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
      'ownershipDisclosureFile',
      {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      },
    ),
    partyType: joi
      .string()
      .valid(...Object.values(PARTY_TYPES))
      .required(),
    petitionFile: joi.object().required(), // object of type File
    petitionFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
      'petitionFile',
      {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      },
    ),
    petitionPaymentDate: JoiValidationConstants.ISO_DATE.max('now').when(
      'petitionPaymentStatus',
      {
        is: PAYMENT_STATUS.PAID,
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      },
    ),
    petitionPaymentMethod: Case.VALIDATION_RULES.petitionPaymentMethod,
    petitionPaymentStatus: Case.VALIDATION_RULES.petitionPaymentStatus,
    petitionPaymentWaivedDate: Case.VALIDATION_RULES.petitionPaymentWaivedDate,
    preferredTrialCity: joi
      .alternatives()
      .conditional('requestForPlaceOfTrialFile', {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.string().required(),
      }),
    procedureType: joi
      .string()
      .valid(...PROCEDURE_TYPES)
      .required(),
    receivedAt: JoiValidationConstants.ISO_DATE.max('now').required(),
    requestForPlaceOfTrialFile: joi
      .alternatives()
      .conditional('preferredTrialCity', {
        is: joi.exist().not(null),
        otherwise: joi.object().optional(),
        then: joi.object().required(), // object of type File
      }),
    requestForPlaceOfTrialFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when(
      'requestForPlaceOfTrialFile',
      {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      },
    ),
    statistics: Case.VALIDATION_RULES.statistics,
    stinFile: joi.object().optional(), // object of type File
    stinFileSize: JoiValidationConstants.MAX_FILE_SIZE_BYTES.when('stinFile', {
      is: joi.exist().not(null),
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
    useSameAsPrimary: Case.VALIDATION_RULES.useSameAsPrimary,
  })
  .or(
    'preferredTrialCity',
    'requestForPlaceOfTrialFile',
    'orderDesignatingPlaceOfTrial',
  );

joiValidationDecorator(
  CaseInternal,
  paperRequirements,
  CaseInternal.VALIDATION_ERROR_MESSAGES,
);

const originalGetValidationErrors = CaseInternal.prototype.getValidationErrors;

CaseInternal.prototype.getValidationErrors = function () {
  const validationErrors = originalGetValidationErrors.call(this);

  if (validationErrors && validationErrors['object.missing']) {
    validationErrors['chooseAtLeastOneValue'] =
      validationErrors['object.missing'];
    delete validationErrors['object.missing'];
  }

  return validationErrors;
};

module.exports = { CaseInternal };
