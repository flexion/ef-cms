const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { ContactFactory } = require('./contacts/ContactFactory');

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function Practitioner(rawUser) {
  this.barNumber = rawUser.barNumber;
  this.email = rawUser.email;
  this.name = rawUser.name;
  this.role = rawUser.role || 'petitioner';
  this.section = rawUser.section;
  this.token = rawUser.token;
  this.representingPrimary = rawUser.representingPrimary;
  this.representingSecondary = rawUser.representingSecondary;
  this.userId = rawUser.userId;
  if (rawUser.contact) {
    this.contact = {
      address1: rawUser.contact.address1,
      address2: rawUser.contact.address2 || undefined,
      address3: rawUser.contact.address3 || undefined,
      city: rawUser.contact.city,
      country: rawUser.contact.country,
      countryType: rawUser.contact.countryType,
      phone: rawUser.contact.phone,
      postalCode: rawUser.contact.postalCode,
      state: rawUser.contact.state,
    };
  }
}

joiValidationDecorator(
  Practitioner,
  joi.object().keys({
    barNumber: joi.string().optional(),
    contact: joi
      .object()
      .keys({
        address1: joi.string().required(),
        address2: joi.string().optional(),
        address3: joi.string().optional(),
        city: joi.string().required(),
        country: joi.when('countryType', {
          is: ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
          otherwise: joi
            .string()
            .optional()
            .allow(null),
          then: joi.string().required(),
        }),
        countryType: joi
          .string()
          .valid(
            ContactFactory.COUNTRY_TYPES.DOMESTIC,
            ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
          )
          .required(),

        phone: joi.string().required(),

        postalCode: joi.when('countryType', {
          is: ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
          otherwise: joi
            .string()
            .regex(/^\d{5}(-\d{4})?$/)
            .required(),
          then: joi.string().required(),
        }),

        state: joi.when('countryType', {
          is: ContactFactory.COUNTRY_TYPES.INTERNATIONAL,
          otherwise: joi.string().required(),
          then: joi
            .string()
            .optional()
            .allow(null),
        }),
      })
      .optional(),
    email: joi.string().optional(),
    name: joi.string().optional(),
    representingPrimary: joi.boolean().optional(),
    representingSecondary: joi.boolean().optional(),
    token: joi.string().optional(),
    userId: joi.string().required(),
  }),
  undefined,
  {},
);

Practitioner.validationName = 'Practitioner';

module.exports = { Practitioner };
