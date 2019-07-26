const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
} = require('../../../persistence/s3/getUploadPolicy');
const { Case } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');

/**
 * CaseExternal Entity
 * Represents a Case with required documents that a Petitioner is attempting to add to the system.
 *
 * @param rawCase
 * @constructor
 */
function CaseExternal(rawCase) {
  this.businessType = rawCase.businessType;
  this.caseType = rawCase.caseType;
  this.contactPrimary = rawCase.contactPrimary;
  this.contactSecondary = rawCase.contactSecondary;
  this.countryType = rawCase.countryType;
  this.filingType = rawCase.filingType;
  this.hasIrsNotice = rawCase.hasIrsNotice;
  this.ownershipDisclosureFile = rawCase.ownershipDisclosureFile;
  this.ownershipDisclosureFileSize = rawCase.ownershipDisclosureFileSize;
  this.partyType = rawCase.partyType;
  this.petitionFile = rawCase.petitionFile;
  this.petitionFileSize = rawCase.petitionFileSize;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;
  this.stinFile = rawCase.stinFile;
  this.stinFileSize = rawCase.stinFileSize;

  const contacts = ContactFactory.createContacts({
    contactInfo: {
      primary: rawCase.contactPrimary,
      secondary: rawCase.contactSecondary,
    },
    partyType: rawCase.partyType,
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
}

CaseExternal.errorToMessageMap = Case.COMMON_ERROR_MESSAGES;

joiValidationDecorator(
  CaseExternal,
  joi.object().keys({
    businessType: joi
      .string()
      .optional()
      .allow(null),
    caseType: joi.when('hasIrsNotice', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi.string().required(),
    }),
    countryType: joi.string().optional(),
    filingType: joi.string().required(),
    hasIrsNotice: joi.boolean().required(),
    ownershipDisclosureFile: joi.object().when('filingType', {
      is: 'A business',
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
    ownershipDisclosureFileSize: joi.when('ownershipDisclosureFile', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi
        .number()
        .required()
        .min(1)
        .max(MAX_FILE_SIZE_BYTES)
        .integer(),
    }),
    partyType: joi.string().required(),
    petitionFile: joi.object().required(),
    petitionFileSize: joi.when('petitionFile', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi
        .number()
        .required()
        .min(1)
        .max(MAX_FILE_SIZE_BYTES)
        .integer(),
    }),
    preferredTrialCity: joi.string().required(),
    procedureType: joi.string().required(),
    stinFile: joi.object().required(),
    stinFileSize: joi.when('stinFile', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi
        .number()
        .required()
        .min(1)
        .max(MAX_FILE_SIZE_BYTES)
        .integer(),
    }),
  }),
  function() {
    return !this.getFormattedValidationErrors();
  },
  CaseExternal.errorToMessageMap,
);

module.exports = { CaseExternal };
