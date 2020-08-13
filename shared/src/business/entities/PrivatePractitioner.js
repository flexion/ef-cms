const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { baseUserValidation, userDecorator } = require('./User');
const { ROLES } = require('./EntityConstants');
const { SERVICE_INDICATOR_TYPES } = require('./EntityConstants');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function PrivatePractitioner(rawUser) {
  userDecorator(this, rawUser);
  this.entityName = 'PrivatePractitioner';
  this.representingPrimary = rawUser.representingPrimary;
  this.representingSecondary = rawUser.representingSecondary;
  this.representing = rawUser.representing || [];
  this.serviceIndicator =
    rawUser.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
}

PrivatePractitioner.VALIDATION_RULES = joi.object().keys({
  ...baseUserValidation,
  entityName: joi.string().valid('PrivatePractitioner').required(),
  representing: joi
    .array()
    .items(JoiValidationConstants.UUID)
    .optional()
    .description('List of contact IDs of contacts'),
  representingPrimary: joi.boolean().optional(),
  representingSecondary: joi.boolean().optional(),
  role: joi.string().required().valid(ROLES.privatePractitioner),
  serviceIndicator: joi
    .string()
    .valid(...Object.values(SERVICE_INDICATOR_TYPES))
    .required(),
});

joiValidationDecorator(
  PrivatePractitioner,
  PrivatePractitioner.VALIDATION_RULES,
  {},
);

PrivatePractitioner.validationName = 'PrivatePractitioner';

module.exports = { PrivatePractitioner };
