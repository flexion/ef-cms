const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { compareStrings } = require('../../utilities/sortFunctions');
const { ContactFactory } = require('../contacts/ContactFactory');
const { DOCKET_NUMBER_SUFFIXES, PARTY_TYPES } = require('../EntityConstants');
const { IrsPractitioner } = require('../IrsPractitioner');
const { isSealedCase } = require('./Case');
const { PrivatePractitioner } = require('../PrivatePractitioner');
const { PublicContact } = require('./PublicContact');
const { PublicDocketEntry } = require('./PublicDocketEntry');

/**
 * Public Case Entity for Unassociated IRS Practitioner
 * Represents the view of the public case.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function CaseExternalForIrsPractitioner() {}
CaseExternalForIrsPractitioner.prototype.init = function init(
  rawCase,
  { applicationContext },
) {
  this.caseCaption = rawCase.caseCaption;
  this.docketNumber = rawCase.docketNumber;
  this.docketNumberSuffix = rawCase.docketNumberSuffix;
  this.docketNumberWithSuffix =
    rawCase.docketNumberWithSuffix ||
    `${this.docketNumber}${this.docketNumberSuffix || ''}`;
  this.entityName = 'CaseExternalForIrsPractitioner';
  this.hasIrsPractitioner =
    !!rawCase.irsPractitioners && rawCase.irsPractitioners.length > 0;
  this.partyType = rawCase.partyType;
  this.receivedAt = rawCase.receivedAt;

  if (rawCase['_score']) {
    this._score = rawCase['_score'];
  }

  this.isSealed = isSealedCase(rawCase);

  const contacts = ContactFactory.createContacts({
    applicationContext,
    contactInfo: {
      otherFilers: rawCase.otherFilers,
      otherPetitioners: rawCase.otherPetitioners,
      primary: rawCase.contactPrimary,
      secondary: rawCase.contactSecondary,
    },
    isPaper: rawCase.isPaper,
    partyType: rawCase.partyType,
  });

  this.otherPetitioners = contacts.otherPetitioners;
  this.otherFilers = contacts.otherFilers;
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;

  this.irsPractitioners = (rawCase.irsPractitioners || []).map(
    irsPractitioner => new IrsPractitioner(irsPractitioner),
  );
  this.privatePractitioners = (rawCase.privatePractitioners || []).map(
    practitioner => new PrivatePractitioner(practitioner),
  );

  // rawCase.docketEntries is not returned in elasticsearch queries due to _source definition
  this.docketEntries = (rawCase.docketEntries || [])
    .filter(docketEntry => !docketEntry.isDraft && docketEntry.isOnDocketRecord)
    .map(
      docketEntry => new PublicDocketEntry(docketEntry, { applicationContext }),
    )
    .sort((a, b) => compareStrings(a.createdAt, b.createdAt));
};

CaseExternalForIrsPractitioner.validationName =
  'CaseExternalForIrsPractitioner';

const caseSchema = {
  caseCaption: JoiValidationConstants.CASE_CAPTION.optional(),
  contactPrimary: PublicContact.VALIDATION_RULES.required(),
  contactSecondary: PublicContact.VALIDATION_RULES.optional().allow(null),
  docketEntries: joi
    .array()
    .items(PublicDocketEntry.VALIDATION_RULES)
    .required()
    .description('List of DocketEntry Entities for the case.'),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Unique case identifier in XXXXX-YY format.',
  ),
  docketNumberSuffix: JoiValidationConstants.STRING.allow(null)
    .valid(...Object.values(DOCKET_NUMBER_SUFFIXES))
    .optional(),
  docketNumberWithSuffix: JoiValidationConstants.STRING.optional().description(
    'Auto-generated from docket number and the suffix.',
  ),
  hasIrsPractitioner: joi.boolean().required(),
  isSealed: joi.boolean(),
  partyType: JoiValidationConstants.STRING.valid(...Object.values(PARTY_TYPES))
    .required()
    .description('Party type of the case petitioner.'),
  receivedAt: JoiValidationConstants.ISO_DATE.optional(),
};

const sealedCaseSchemaRestricted = {
  caseCaption: joi.any().forbidden(),
  contactPrimary: PublicContact.VALIDATION_RULES.required(),
  contactSecondary: PublicContact.VALIDATION_RULES.optional().allow(null),
  createdAt: joi.any().forbidden(),
  docketEntries: joi.array().max(0),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
  docketNumberSuffix: JoiValidationConstants.STRING.valid(
    ...Object.values(DOCKET_NUMBER_SUFFIXES),
  ).optional(),
  hasIrsPractitioner: joi.boolean(),
  irsPractitioners: joi
    .array()
    .items(IrsPractitioner.VALIDATION_RULES)
    .optional()
    .allow(null),
  isSealed: joi.boolean(),
  otherFilers: joi
    .array()
    .items(PublicContact.VALIDATION_RULES)
    .optional()
    .allow(null),
  otherPetitioners: joi
    .array()
    .items(PublicContact.VALIDATION_RULES)
    .optional()
    .allow(null),
  partyType: joi.any().forbidden(),
  privatePractitioners: joi
    .array()
    .items(PrivatePractitioner.VALIDATION_RULES)
    .optional()
    .allow(null),
  receivedAt: joi.any().forbidden(),
};

joiValidationDecorator(
  CaseExternalForIrsPractitioner,
  joi.object(caseSchema).when(joi.object({ isSealed: true }).unknown(), {
    then: joi.object(sealedCaseSchemaRestricted),
  }),
  {},
);

module.exports = {
  CaseExternalForIrsPractitioner: validEntityDecorator(
    CaseExternalForIrsPractitioner,
  ),
};
