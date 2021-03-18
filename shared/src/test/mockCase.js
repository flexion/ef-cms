const {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
} = require('../business/entities/EntityConstants');
const { MOCK_DOCUMENTS } = require('./mockDocuments');

exports.MOCK_CASE = {
  archivedDocketEntries: [],
  caseCaption: 'Test Petitioner, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  correspondence: [],
  createdAt: '2018-03-01T21:40:46.415Z',
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '101-18',
  docketNumberWithSuffix: '101-18',
  filingType: 'Myself',
  irsNoticeDate: '2018-03-01T00:00:00.000Z',
  partyType: PARTY_TYPES.petitioner,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      isContactPrimary: true,
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      state: 'TN',
      title: 'Executor',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.new,
};

exports.MOCK_CASE_WITHOUT_PENDING = {
  caseCaption: 'Test Petitioner, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  contactPrimary: {
    address1: '123 Main St',
    city: 'Somewhere',
    contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    countryType: COUNTRY_TYPES.DOMESTIC,
    email: 'petitioner@example.com',
    name: 'Test Petitioner',
    phone: '1234567',
    postalCode: '12345',
    state: 'TN',
    title: 'Executor',
  },
  docketEntries: MOCK_DOCUMENTS.slice(0, 3),
  docketNumber: '101-18', // exclude proposed stipulated decision
  filingType: 'Myself',
  irsNoticeDate: '2018-03-01T00:00:00.000Z',
  partyType: PARTY_TYPES.petitioner,
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.new,
};

exports.MOCK_CASE_WITHOUT_NOTICE = {
  contactPrimary: {
    address1: '123 Main St',
    city: 'Somewhere',
    countryType: COUNTRY_TYPES.DOMESTIC,
    email: 'petitioner@example.com',
    name: 'Test Petitioner',
    phone: '1234567',
    postalCode: '12345',
    state: 'TN',
    title: 'Executor',
  },
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '101-18',
  filingType: 'Myself',
  partyType: PARTY_TYPES.petitioner,
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.new,
};

exports.MOCK_CASE_WITH_SECONDARY_OTHERS = {
  caseCaption: 'Test Petitioner, Test Petitioner 2, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  contactSecondary: {
    address1: '123 Main St',
    city: 'Somewhere',
    contactId: '2226050f-a423-47bb-943b-a5661fe08a6b',
    countryType: COUNTRY_TYPES.DOMESTIC,
    email: 'petitioner@example.com',
    inCareOf: 'Myself',
    name: 'Test Petitioner2',
    phone: '1234567',
    postalCode: '12345',
    state: 'TN',
    title: 'Executor',
  },
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '109-19',
  filingType: 'Myself',
  otherFilers: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '3336050f-a423-47bb-943b-a5661fe08a6b',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner3',
      otherFilerType: 'Tax Matters Partner',
      phone: '1234567',
      postalCode: '12345',
      state: 'TN',
      title: 'Tax Matters Partner',
    },
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '4446050f-a423-47bb-943b-a5661fe08a6b',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner4',
      otherFilerType: 'Tax Matters Partner',
      phone: '1234567',
      postalCode: '12345',
      state: 'TN',
      title: 'Tax Matters Partner',
    },
  ],
  otherPetitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '3336050f-a423-47bb-943b-a5661fe08a6b',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner3',
      otherFilerType: 'Tax Matters Partner',
      phone: '1234567',
      postalCode: '12345',
      state: 'TN',
      title: 'Tax Matters Partner',
    },
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '4446050f-a423-47bb-943b-a5661fe08a6b',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      inCareOf: 'Myself',
      name: 'Test Petitioner4',
      otherFilerType: 'Tax Matters Partner',
      phone: '1234567',
      postalCode: '12345',
      state: 'TN',
      title: 'Tax Matters Partner',
    },
  ],
  partyType: PARTY_TYPES.petitionerDeceasedSpouse,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      isContactPrimary: true,
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      state: 'TN',
      title: 'Executor',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.new,
};

exports.MOCK_CASE_WITH_TRIAL_SESSION = {
  archivedDocketEntries: [],
  associatedJudge: 'Judge Fieri',
  caseCaption: 'Test Petitioner, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  correspondence: [],
  createdAt: '2018-03-01T21:40:46.415Z',
  docketEntries: MOCK_DOCUMENTS,
  docketNumber: '101-18',
  docketNumberWithSuffix: '101-18',
  filingType: 'Myself',
  irsNoticeDate: '2018-03-01T00:00:00.000Z',
  partyType: PARTY_TYPES.petitioner,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      isContactPrimary: true,
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      state: 'TN',
      title: 'Executor',
    },
  ],
  preferredTrialCity: 'Washington, District of Columbia',
  procedureType: 'Regular',
  status: CASE_STATUS_TYPES.calendared,
  trialDate: '2020-03-01T00:00:00.000Z',
  trialLocation: 'Washington, District of Columbia',
  trialSessionId: '7805d1ab-18d0-43ec-bafb-654e83405410',
  trialTime: '10:00',
};

exports.MOCK_ELIGIBLE_CASE = {
  caseCaption: 'Guy Fieri & Gordon Ramsay, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  docketNumber: '321-21',
  docketNumberSuffix: 'W',
  highPriority: true,
  irsPractitioners: [],
  privatePractitioners: [],
};

exports.MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS = {
  caseCaption: 'Guy Fieri & Gordon Ramsay, Petitioner',
  caseType: CASE_TYPES_MAP.other,
  docketNumber: '321-21',
  docketNumberSuffix: 'W',
  highPriority: true,
  irsPractitioners: [
    {
      barNumber: 'VS0062',
      contact: {
        address1: '016 Miller Loop Apt. 494',
        address2: 'Apt. 835',
        address3: null,
        city: 'Cristianville',
        country: 'U.S.A.',
        countryType: 'domestic',
        phone: '001-016-669-6532x5946',
        postalCode: '68117',
        state: 'NE',
      },
      email: 'adam22@example.com',
      entityName: 'IrsPractitioner',
      name: 'Isaac Benson',
      role: 'irsPractitioner',
      serviceIndicator: 'Electronic',
      userId: '020374b7-b274-462b-8a16-65783147efa9',
    },
  ],
  privatePractitioners: [
    {
      barNumber: 'OK0063',
      contact: {
        address1: '5943 Joseph Summit',
        address2: 'Suite 334',
        address3: null,
        city: 'Millermouth',
        country: 'U.S.A.',
        countryType: 'domestic',
        phone: '348-858-8312',
        postalCode: '99517',
        state: 'AK',
      },
      email: 'thomastorres@example.com',
      entityName: 'PrivatePractitioner',
      name: 'Brandon Choi',
      role: 'privatePractitioner',
      serviceIndicator: 'Electronic',
      userId: '3bcd5fb7-434e-4354-aa08-1d10846c1867',
    },
  ],
};
