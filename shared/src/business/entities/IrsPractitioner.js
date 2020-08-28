const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  USER_CONTACT_VALIDATION_RULES,
  userDecorator,
  VALIDATION_ERROR_MESSAGES,
} = require('./User');
const { ROLES, SERVICE_INDICATOR_TYPES } = require('./EntityConstants');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function IrsPractitioner() {
  this.entityName = 'IrsPractitioner';
}

IrsPractitioner.prototype.init = function init(rawUser) {
  userDecorator(this, rawUser);
  this.barNumber = rawUser.barNumber;
  this.serviceIndicator =
    rawUser.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
};

IrsPractitioner.validationName = 'IrsPractitioner';

IrsPractitioner.VALIDATION_RULES = joi.object().keys({
  barNumber: joi
    .string()
    .max(100)
    .required()
    .description(
      'A unique identifier comprising of the practitioner initials, date, and series number.',
    ),
  contact: joi.object().keys(USER_CONTACT_VALIDATION_RULES).optional(),
  email: JoiValidationConstants.EMAIL.optional(),
  entityName: joi.string().valid('IrsPractitioner').required(),
  name: joi.string().max(100).required(),
  role: joi.string().valid(ROLES.irsPractitioner).required(),
  serviceIndicator: joi
    .string()
    .valid(...Object.values(SERVICE_INDICATOR_TYPES))
    .required(),
  token: joi.string().optional(),
  userId: JoiValidationConstants.UUID.required(),
});

joiValidationDecorator(
  validEntityDecorator(IrsPractitioner),
  IrsPractitioner.VALIDATION_RULES,
  VALIDATION_ERROR_MESSAGES,
);

exports.IrsPractitioner = validEntityDecorator(IrsPractitioner);
