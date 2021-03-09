const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { DOCKET_NUMBER_SUFFIXES } = require('../EntityConstants');
const { IrsPractitioner } = require('../IrsPractitioner');
const { PrivatePractitioner } = require('../PrivatePractitioner');

/**
 * Eligible Case Entity
 * Represents an eligible case on a trial session
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function EligibleCase() {}
EligibleCase.prototype.init = function init(rawCase) {
  this.entityName = 'EligibleCase';
  this.caseCaption = rawCase.caseCaption;
  this.docketNumber = rawCase.docketNumber;
  this.docketNumberSuffix = rawCase.docketNumberSuffix;
  this.highPriority = rawCase.highPriority;
  this.caseType = rawCase.caseType;

  if (Array.isArray(rawCase.privatePractitioners)) {
    this.privatePractitioners = rawCase.privatePractitioners.map(
      practitioner => new PrivatePractitioner(practitioner),
    );
  } else {
    this.privatePractitioners = [];
  }

  if (Array.isArray(rawCase.irsPractitioners)) {
    this.irsPractitioners = rawCase.irsPractitioners.map(
      practitioner => new IrsPractitioner(practitioner),
    );
  } else {
    this.irsPractitioners = [];
  }
};

const eligibleCaseSchema = {
  caseCaption: JoiValidationConstants.CASE_CAPTION.optional(),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Unique case identifier in XXXXX-YY format.',
  ),
  docketNumberSuffix: JoiValidationConstants.STRING.allow(null)
    .valid(...Object.values(DOCKET_NUMBER_SUFFIXES))
    .optional(),
  irsPractitioners: joi
    .array()
    .items(IrsPractitioner.VALIDATION_RULES)
    .optional()
    .description(
      'List of IRS practitioners (also known as respondents) associated with the case.',
    ),
  isPaper: joi.boolean().optional(),
  isSealed: joi.boolean(),
};

joiValidationDecorator(EligibleCase, joi.object(eligibleCaseSchema), {});

module.exports = {
  EligibleCase: validEntityDecorator(EligibleCase),
};
