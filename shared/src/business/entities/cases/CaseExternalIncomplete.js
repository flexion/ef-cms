const joi = require('@hapi/joi');
const {
  BUSINESS_TYPES,
  COUNTRY_TYPES,
  FILING_TYPES,
  PARTY_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} = require('../EntityConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { Case } = require('./Case');
const { ContactFactory } = require('../contacts/ContactFactory');

/**
 * CaseExternalIncomplete
 * Represents a Case without required documents that a Petitioner is attempting to add to the system.
 * After the Case's files have been saved, a Petition is created to include the document metadata.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function CaseExternalIncomplete(rawCase) {
  this.businessType = rawCase.businessType;
  this.caseType = rawCase.caseType;
  this.contactPrimary = rawCase.contactPrimary;
  this.contactSecondary = rawCase.contactSecondary;
  this.countryType = rawCase.countryType;
  this.filingType = rawCase.filingType;
  this.hasIrsNotice = rawCase.hasIrsNotice;
  this.partyType = rawCase.partyType;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;

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

CaseExternalIncomplete.VALIDATION_ERROR_MESSAGES =
  Case.VALIDATION_ERROR_MESSAGES;

joiValidationDecorator(
  CaseExternalIncomplete,
  joi.object().keys({
    businessType: joi
      .string()
      .valid(...Object.values(BUSINESS_TYPES))
      .optional()
      .allow(null),
    caseType: joi.string().when('hasIrsNotice', {
      is: joi.exist(),
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
    contactPrimary: joi.object().optional(),
    contactSecondary: joi.object().optional(),
    countryType: joi
      .string()
      .valid(COUNTRY_TYPES.DOMESTIC, COUNTRY_TYPES.INTERNATIONAL)
      .optional(),
    filingType: joi
      .string()
      .valid(
        ...FILING_TYPES[ROLES.petitioner],
        ...FILING_TYPES[ROLES.privatePractitioner],
      )
      .required(),
    hasIrsNotice: joi.boolean().required(),
    partyType: joi
      .string()
      .valid(...Object.values(PARTY_TYPES))
      .required(),
    preferredTrialCity: joi
      .alternatives()
      .try(
        joi.string().valid(...TRIAL_CITY_STRINGS, null),
        joi.string().pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
      )
      .required(),
    procedureType: joi
      .string()
      .valid(...PROCEDURE_TYPES)
      .required(),
  }),
  CaseExternalIncomplete.VALIDATION_ERROR_MESSAGES,
);

module.exports = { CaseExternalIncomplete };
