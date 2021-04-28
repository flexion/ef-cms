const joi = require('joi');
const {
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
  STATE_NOT_AVAILABLE,
  US_STATES,
  US_STATES_OTHER,
} = require('../EntityConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 * constructor
 *
 * @param {object} rawUser the raw petitioner data
 * @constructor
 */
function Petitioner() {
  this.entityName = 'Petitioner';
}

Petitioner.prototype.init = function init(rawContact, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.contactId = rawContact.contactId || applicationContext.getUniqueId();
  this.address1 = rawContact.address1;
  this.address2 = rawContact.address2 || undefined;
  this.address3 = rawContact.address3 || undefined;
  this.city = rawContact.city;
  this.contactType = rawContact.contactType;
  this.country = rawContact.country;
  this.countryType = rawContact.countryType;
  this.email = rawContact.email;
  this.inCareOf = rawContact.inCareOf;
  this.isAddressSealed = rawContact.isAddressSealed || false;
  this.sealedAndUnavailable = rawContact.sealedAndUnavailable || false;
  this.name = rawContact.name;
  this.phone = rawContact.phone;
  this.postalCode = rawContact.postalCode;
  this.secondaryName = rawContact.secondaryName;
  this.serviceIndicator = rawContact.serviceIndicator;
  this.state = rawContact.state;
  this.title = rawContact.title;
  this.additionalName = rawContact.additionalName;
  this.otherFilerType = rawContact.otherFilerType;
  this.hasEAccess = rawContact.hasEAccess || undefined;
};

Petitioner.VALIDATION_RULES = {
  address1: JoiValidationConstants.STRING.max(100).required(),
  address2: JoiValidationConstants.STRING.max(100).optional().allow(null),
  address3: JoiValidationConstants.STRING.max(100).optional().allow(null),
  city: JoiValidationConstants.STRING.max(100).required(),
  contactId: JoiValidationConstants.UUID.required().description(
    'Unique contact ID only used by the system.',
  ),
  country: JoiValidationConstants.STRING.when('countryType', {
    is: COUNTRY_TYPES.INTERNATIONAL,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  countryType: JoiValidationConstants.STRING.valid(
    COUNTRY_TYPES.DOMESTIC,
    COUNTRY_TYPES.INTERNATIONAL,
  ).required(),
  email: JoiValidationConstants.EMAIL.when('hasEAccess', {
    is: true,
    otherwise: joi.optional(),
    then: joi.required(),
  }),
  hasEAccess: joi
    .boolean()
    .optional()
    .description(
      'Flag that indicates if the contact has credentials to both the legacy and new system.',
    ),
  inCareOf: JoiValidationConstants.STRING.max(100).optional(),
  isAddressSealed: joi.boolean().required(),
  name: JoiValidationConstants.STRING.max(100).required(),
  phone: JoiValidationConstants.STRING.max(100).required(),
  postalCode: joi.when('countryType', {
    is: COUNTRY_TYPES.INTERNATIONAL,
    otherwise: JoiValidationConstants.US_POSTAL_CODE.required(),
    then: JoiValidationConstants.STRING.max(100).required(),
  }),
  sealedAndUnavailable: joi.boolean().optional(),
  secondaryName: JoiValidationConstants.STRING.max(100).optional(),
  serviceIndicator: JoiValidationConstants.STRING.valid(
    ...Object.values(SERVICE_INDICATOR_TYPES),
  ).required(),
  state: JoiValidationConstants.STRING.when('countryType', {
    is: COUNTRY_TYPES.INTERNATIONAL,
    otherwise: joi
      .valid(...Object.keys(US_STATES), ...US_STATES_OTHER, STATE_NOT_AVAILABLE)
      .required(),
    then: joi.optional().allow(null),
  }),
  title: JoiValidationConstants.STRING.max(100).optional(),
};

Petitioner.VALIDATION_ERROR_MESSAGES = {
  address1: 'Enter mailing address',
  city: 'Enter city',
  country: 'Enter a country',
  countryType: 'Enter country type',
  name: 'Enter name',
  phone: 'Enter phone number',
  postalCode: [
    {
      contains: 'match',
      message: 'Enter ZIP code',
    },
    'Enter ZIP code',
  ],
  serviceIndicator: 'Select a service indicator',
  state: 'Enter state',
};

joiValidationDecorator(
  Petitioner,
  joi.object().keys(Petitioner.VALIDATION_RULES),
  Petitioner.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  Petitioner: validEntityDecorator(Petitioner),
};
