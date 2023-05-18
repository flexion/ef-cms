import { COUNTRY_TYPES, PARTY_TYPES } from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { validatePetitionInteractor } from './validatePetitionInteractor';

describe('validatePetitionInteractor', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validatePetitionInteractor(applicationContext, {
      petition: {},
    });

    expect(Object.keys(errors)).toEqual([
      'filingType',
      'hasIrsNotice',
      'partyType',
      'petitionFile',
      'preferredTrialCity',
      'procedureType',
      'stinFile',
    ]);
  });

  it('returns the expected errors object when caseType is defined', () => {
    const errors = validatePetitionInteractor(applicationContext, {
      petition: {
        caseType: 'defined',
        hasIrsNotice: true,
        petitionFile: new File(['abc'], 'test.png'),
        stinFile: new File(['abc'], 'test.png'),
      },
    });
    expect(Object.keys(errors)).toEqual([
      'filingType',
      'partyType',
      'preferredTrialCity',
      'procedureType',
    ]);
  });

  it('returns the expected errors object', () => {
    const errors = validatePetitionInteractor(applicationContext, {
      petition: {
        caseType: 'defined',
        contactPrimary: {
          address1: '876 12th Ave',
          city: 'Nashville',
          country: 'USA',
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'someone@example.com',
          name: 'Jimmy Dean',
          phone: '1234567890',
          postalCode: '05198',
          state: 'AK',
        },
        filingType: 'Myself',
        hasIrsNotice: true,
        partyType: PARTY_TYPES.petitioner,
        petitionFile: new File(['abc'], 'test.png'),
        preferredTrialCity: 'Memphis, Tennessee',
        procedureType: 'Regular',
        stinFile: new File(['abc'], 'testStinFile.pdf'),
      },
    });
    expect(errors).toEqual(null);
  });
});
