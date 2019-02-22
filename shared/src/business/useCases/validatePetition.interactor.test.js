const { validatePetition } = require('./validatePetition.interactor');
const Petition = require('../entities/Petition');
const { omit } = require('lodash');
const moment = require('moment');

describe('validatePetition', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetition({
      petition: {},
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
    });

    expect(errors).toEqual({
      ...omit(Petition.errorToMessageMap, [
        'ownershipDisclosureFile',
        'irsNoticeDate',
      ]),
    });
  });

  it('returns the expected errors object when caseType is defined', () => {
    const errors = validatePetition({
      petition: {
        caseType: 'defined',
        hasIrsNotice: true,
      },
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
    });
    expect(errors).toEqual({
      ...omit(Petition.errorToMessageMap, [
        'caseType',
        'hasIrsNotice',
        'ownershipDisclosureFile',
      ]),
      irsNoticeDate: 'Notice Date is a required field.',
    });
  });

  it('returns the expected errors object', () => {
    const errors = validatePetition({
      petition: {
        hasIrsNotice: true,
        caseType: 'defined',
        procedureType: 'defined',
        filingType: 'defined',
        petitionFile: new File([], 'test.png'),
        preferredTrialCity: 'defined',
        irsNoticeDate: new Date().toISOString(),
        signature: true,
      },
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
    });
    expect(errors).toEqual(null);
  });

  it('returns an error for a irs notice date in the future', () => {
    const futureDate = moment().add(1, 'days');

    const errors = validatePetition({
      petition: {
        hasIrsNotice: true,
        caseType: 'defined',
        procedureType: 'defined',
        filingType: 'defined',
        petitionFile: new File([], 'test.png'),
        preferredTrialCity: 'defined',
        irsNoticeDate: futureDate.toDate().toISOString(),
        signature: true,
      },
      applicationContext: {
        getEntityConstructors: () => ({
          Petition,
        }),
      },
    });

    expect(errors).toEqual({
      irsNoticeDate: 'Notice Date is in the future. Please enter a valid date.',
    });
  });
});
