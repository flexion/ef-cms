const joi = require('@hapi/joi');
const {
  COUNTRY_TYPES,
  ROLES,
  US_STATES,
  US_STATES_OTHER,
} = require('./EntityConstants');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');

const userDecorator = (obj, rawObj) => {
  obj.entityName = 'User';
  obj.barNumber = rawObj.barNumber;
  obj.email = rawObj.email;
  obj.name = rawObj.name;
  obj.role = rawObj.role || ROLES.petitioner;
  obj.section = rawObj.section;
  obj.token = rawObj.token;
  obj.userId = rawObj.userId;
  if (rawObj.contact) {
    obj.contact = {
      address1: rawObj.contact.address1,
      address2: rawObj.contact.address2 ? rawObj.contact.address2 : null,
      address3: rawObj.contact.address3 ? rawObj.contact.address3 : null,
      city: rawObj.contact.city,
      country: rawObj.contact.country,
      countryType: rawObj.contact.countryType,
      phone: rawObj.contact.phone,
      postalCode: rawObj.contact.postalCode,
      state: rawObj.contact.state,
    };
  }
  if (obj.role === ROLES.judge) {
    obj.judgeFullName = rawObj.judgeFullName;
    obj.judgeTitle = rawObj.judgeTitle;
  }
};

const baseUserValidation = {
  judgeFullName: joi.when('role', {
    is: ROLES.judge,
    otherwise: joi.optional().allow(null),
    then: joi.string().max(100).optional(),
  }),
  judgeTitle: joi.when('role', {
    is: ROLES.judge,
    otherwise: joi.optional().allow(null),
    then: joi.string().max(100).optional(),
  }),
  name: joi.string().max(100).optional(),
  role: joi
    .string()
    .valid(...Object.values(ROLES))
    .required(),
};

const userValidation = {
  barNumber: joi.string().optional().allow(null),
  contact: joi
    .object()
    .keys({
      address1: joi.string().max(100).required(),
      address2: joi.string().max(100).optional().allow(null),
      address3: joi.string().max(100).optional().allow(null),
      city: joi.string().max(100).required(),
      country: joi.when('countryType', {
        is: COUNTRY_TYPES.INTERNATIONAL,
        otherwise: joi.string().optional().allow(null),
        then: joi.string().required(),
      }),
      countryType: joi
        .string()
        .valid(COUNTRY_TYPES.DOMESTIC, COUNTRY_TYPES.INTERNATIONAL)
        .required(),
      phone: joi.string().max(100).required(),
      postalCode: joi.when('countryType', {
        is: COUNTRY_TYPES.INTERNATIONAL,
        otherwise: JoiValidationConstants.US_POSTAL_CODE.required(),
        then: joi.string().max(100).required(),
      }),
      state: joi.when('countryType', {
        is: COUNTRY_TYPES.INTERNATIONAL,
        otherwise: joi
          .string()
          .valid(...Object.keys(US_STATES), ...US_STATES_OTHER)
          .required(),
        then: joi.string().optional().allow(null),
      }),
    })
    .optional(),
  email: joi.string().max(100).optional(),
  entityName: joi.string().valid('User').required(),
  section: joi
    .string()
    // Removed temporarily: Eric will re-add
    // .valid(...SECTIONS, ...CHAMBERS_SECTIONS, ...Object.values(ROLES))
    .optional(),
  token: joi.string().optional(),
  userId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required(),
  ...baseUserValidation,
};

const VALIDATION_ERROR_MESSAGES = {
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
  state: 'Enter state',
};

/**
 * constructor
 *
 * @param {object} rawUser the raw user data
 * @constructor
 */
function User(rawUser) {
  userDecorator(this, rawUser);
}

User.validationName = 'User';

joiValidationDecorator(
  User,
  joi.object().keys(userValidation),
  VALIDATION_ERROR_MESSAGES,
);

User.isExternalUser = function (role) {
  const externalRoles = [
    ROLES.petitioner,
    ROLES.privatePractitioner,
    ROLES.irsPractitioner,
    ROLES.irsSuperuser,
  ];
  return externalRoles.includes(role);
};

User.isInternalUser = function (role) {
  const internalRoles = [
    ROLES.adc,
    ROLES.admissionsClerk,
    ROLES.chambers,
    ROLES.clerkOfCourt,
    ROLES.docketClerk,
    ROLES.floater,
    ROLES.judge,
    ROLES.petitionsClerk,
    ROLES.trialClerk,
  ];
  return internalRoles.includes(role);
};

module.exports = {
  User,
  VALIDATION_ERROR_MESSAGES,
  baseUserValidation,
  userDecorator,
  userValidation,
};
