const faker = require('faker');
const {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  COUNTRY_TYPES,
  OTHER_FILER_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');

exports.BASE_CASE = {
  ...MOCK_CASE,
  associatedJudge: CHIEF_JUDGE,
  caseCaption: 'A Migrated Casee',
  preferredTrialCity: 'Washington, District of Columbia',
  status: CASE_STATUS_TYPES.calendared,
};

exports.CASE_WITH_OTHER_PETITIONERS = {
  ...exports.BASE_CASE,
  otherPetitioners: [
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      additionalName: `Additional ${faker.name.findName()}`,
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
  ],
};

exports.CASE_WITH_OTHER_FILERS = {
  ...exports.BASE_CASE,
  otherFilers: [
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      otherFilerType: 'Intervenor',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      otherFilerType: 'Tax Matters Partner',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      otherFilerType: 'Tax Matters Partner',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      otherFilerType: 'Tax Matters Partner',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      otherFilerType: 'Tax Matters Partner',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      otherFilerType: 'Tax Matters Partner',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      otherFilerType: 'Tax Matters Partner',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      otherFilerType: 'Tax Matters Partner',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
    {
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      city: faker.address.city(),
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: faker.name.findName(),
      otherFilerType: 'Tax Matters Partner',
      phone: faker.phone.phoneNumber(),
      postalCode: faker.address.zipCode(),
      state: faker.address.stateAbbr(),
      title: OTHER_FILER_TYPES[0],
    },
  ],
};
