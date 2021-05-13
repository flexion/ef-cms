import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { requestAccessHelper as requestAccessHelperComputed } from './requestAccessHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  form: {},
  validationErrors: {},
};

const requestAccessHelper = withAppContextDecorator(
  requestAccessHelperComputed,
  applicationContext,
);

const filersMap = {
  '4e53fade-4966-4efe-8b01-0cb5f587eb47': false,
  '68a1e378-6e96-4e61-b06e-2cb4e6c22f48': true,
  '68a1e378-6e96-4e61-b06g-2cb4e6c22f47': true,
};

applicationContext.getCurrentUser = () => ({
  role: ROLES.privatePractitioner,
});

describe('requestAccessHelper', () => {
  beforeEach(() => {
    state.form = {
      filersMap,
    };
    state.caseDetail = {
      petitioners: [
        {
          contactId: '4e53fade-4966-4efe-8b01-0cb5f587eb47',
          name: 'bob',
        },
        {
          contactId: '68a1e378-6e96-4e61-b06e-2cb4e6c22f48',
          name: 'sally',
        },
        {
          contactId: '68a1e378-6e96-4e61-b06g-2cb4e6c22f47',
          name: 'rick',
        },
      ],
    };
  });

  it('returns correct values when documentType is undefined', () => {
    let testState = {
      ...state,
      form: { documentType: undefined, filersMap: {} },
    };

    const expected = {
      showPrimaryDocumentValid: false,
    };

    const result = runCompute(requestAccessHelper, {
      state: testState,
    });
    expect(result).toMatchObject(expected);
  });

  it('indicates file uploads are valid', () => {
    state.form = {
      documentType: 'Entry of Appearance',
      filersMap,
      primaryDocumentFile: { some: 'file' },
    };

    const result = runCompute(requestAccessHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
  });

  it('generates correctly formatted service date', () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = runCompute(requestAccessHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/12');
  });

  it('does not generate a formatted service date if a service date is not entered on the form', () => {
    const result = runCompute(requestAccessHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toBeUndefined();
  });

  it('does not show party validation error if none of the party validation errors exists', () => {
    const result = runCompute(requestAccessHelper, { state });
    expect(result.partyValidationError).toBeUndefined();
  });

  it('shows party validation error if any one of the party validation errors exists', () => {
    state.validationErrors = { filers: 'You did something bad.' };
    const result = runCompute(requestAccessHelper, { state });
    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  it('returns correct number of document options for user role privatePractitioner', () => {
    const result = runCompute(requestAccessHelper, { state });
    expect(result.documents.length).toEqual(7);
  });

  it('returns correct number of document options for user role irsPractitioner', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
    });
    const result = runCompute(requestAccessHelper, { state });
    expect(result.documents.length).toEqual(2);
  });

  it('shows filing includes if certificate of service or attachments is true', () => {
    state.form = { certificateOfService: true, filersMap };
    let result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingIncludes).toEqual(true);

    state.form = {
      attachments: true,
      certificateOfService: false,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingIncludes).toEqual(true);
  });

  it('does not show filing includes if certificate of service and attachments are false', () => {
    state.form = {
      attachments: false,
      certificateOfService: false,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    const result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingIncludes).toEqual(false);
  });

  it('shows filing not includes if certificate of service, attachments, or supporting documents is false', () => {
    state.form = { certificateOfService: false, filersMap };
    let result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);

    state.form = {
      certificateOfService: true,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);

    state.form = {
      attachments: false,
      certificateOfService: true,
      documentType: 'Notice of Intervention',
      filersMap,
    };
    result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);

    state.form = {
      attachments: true,
      certificateOfService: true,
      documentType: 'Motion to Substitute Parties and Change Caption',
      filersMap,
      hasSupportingDocuments: false,
    };
    result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);
  });

  it('does not show filing not includes if certificate of service, attachments, and supporting documents are true', () => {
    state.form = {
      attachments: true,
      certificateOfService: true,
      documentType: 'Motion to Substitute Parties and Change Caption',
      filersMap,
      hasSupportingDocuments: true,
    };
    const result = runCompute(requestAccessHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(false);
  });
});
