import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { primaryContactEditHelper as primaryContactEditHelperComputed } from './primaryContactEditHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  form: {},
  validationErrors: {},
};

const primaryContactEditHelper = withAppContextDecorator(
  primaryContactEditHelperComputed,
  applicationContext,
);

describe('primaryContactEditHelper', () => {
  it('should set showInCareOf to true when the caseDetail partyType is corporation', () => {
    let testState = {
      ...state,
      caseDetail: {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.corporation,
      },
    };

    const result = runCompute(primaryContactEditHelper, {
      state: testState,
    });
    expect(result.showInCareOf).toBeTruthy();
  });

  it('should set showInCareOf to true when the caseDetail partType is estateWithoutExecutor', () => {
    let testState = {
      ...state,
      caseDetail: {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.estateWithoutExecutor,
      },
    };

    const result = runCompute(primaryContactEditHelper, {
      state: testState,
    });
    expect(result.showInCareOf).toBeTruthy();
  });

  it('should set showInCareOf to false with other party types', () => {
    let testState = {
      ...state,
      caseDetail: {
        ...MOCK_CASE,
        partyType: ContactFactory.PARTY_TYPES.guardian,
      },
    };

    const result = runCompute(primaryContactEditHelper, {
      state: testState,
    });
    expect(result.showInCareOf).toBeFalsy();
  });
});
