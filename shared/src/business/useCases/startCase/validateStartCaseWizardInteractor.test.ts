import { COUNTRY_TYPES } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { validateStartCaseWizardInteractor } from './validateStartCaseWizardInteractor';

describe('validateStartCaseWizardInteractor', () => {
  it('returns the expected errors object on an empty petition', () => {
    const errors = validateStartCaseWizardInteractor(applicationContext, {
      petition: {},
    });

    expect(Object.keys(errors)).toEqual([
      'wizardStep',
      'stinFile',
      'hasIrsNotice',
      'petitionFile',
      'filingType',
      'partyType',
      'preferredTrialCity',
      'procedureType',
    ]);
  });

  it('returns null for a valid petition', () => {
    const errors = validateStartCaseWizardInteractor(applicationContext, {
      petition: {
        ...MOCK_CASE,
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Test Primary',
          phone: '1234567890',
          postalCode: '12345',
          state: 'CA',
        },
        hasIrsNotice: true,
        petitionFile: new File(['abc'], 'test.pdf'),
        stinFile: new File(['abc'], 'test.pdf'),
        wizardStep: '4',
      },
    });

    expect(errors).toEqual(null);
  });
});
