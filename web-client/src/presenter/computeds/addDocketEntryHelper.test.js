import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { addDocketEntryHelper as addDocketEntryHelperComputed } from './addDocketEntryHelper';
import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  form: {},
  validationErrors: {},
};

const addDocketEntryHelper = withAppContextDecorator(
  addDocketEntryHelperComputed,
  applicationContext,
);

describe('addDocketEntryHelper', () => {
  beforeEach(() => {
    state.form = {};
  });

  it('returns correct values when documentType is undefined', () => {
    let testState = { ...state, form: { documentType: undefined } };

    const expected = {
      showObjection: false,
      showPrimaryDocumentValid: false,
      showSecondaryDocumentValid: false,
    };

    const result = runCompute(addDocketEntryHelper, {
      state: testState,
    });
    expect(result).toMatchObject(expected);
    expect(Array.isArray(result.supportingDocumentTypeList)).toBeTruthy();
  });

  it('does not error with empty caseDetail (for cerebral debugger)', () => {
    let testState = {
      caseDetail: {},
    };

    const result = runCompute(addDocketEntryHelper, {
      state: testState,
    });
    expect(result).toMatchObject({});
  });

  it('shows objection if document type is a motion', () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      eventCode: 'M115',
      scenario: 'Nonstandard H',
    };
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showObjection).toBeTruthy();
    expect(result.primary.showSecondaryDocumentForm).toBeTruthy();
  });

  it('indicates file uploads are valid', () => {
    state.form = {
      documentType: 'Agreed Computation for Entry of Decision',
      primaryDocumentFile: { some: 'file' },
    };

    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
  });

  it('generates correctly formatted service date', () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/12');
  });

  it('does not generate a formatted service date if a service date is not entered on the form', () => {
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toBeUndefined();
  });

  it('should show track option as default', () => {
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showTrackOption).toBeTruthy();
  });

  it('should not show track option for auto-tracked items', () => {
    state.form.eventCode = 'OSC';
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showTrackOption).toBeFalsy();
  });

  it('should not show date received edit if filed electronically', () => {
    state.caseDetail.isPaper = false;
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showDateReceivedEdit).toBeFalsy();
  });

  it('should show date received edit if filed with paper', () => {
    state.caseDetail.isPaper = true;
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showDateReceivedEdit).toBeTruthy();
  });

  describe('showFilingPartiesForm', () => {
    it('should be false when the document isAutoGenerated and eventCode is one of NCA/NCAP/NCP', () => {
      state.form = {
        eventCode: 'NCAP',
        isAutoGenerated: true,
      };

      const result = runCompute(addDocketEntryHelper, { state });

      expect(result.showFilingPartiesForm).toBeFalsy();
    });

    it('should be true when the document is NOT auto generated and eventCode is NCA', () => {
      state.form = {
        eventCode: 'NCA',
        isAutoGenerated: false,
      };

      const result = runCompute(addDocketEntryHelper, { state });

      expect(result.showFilingPartiesForm).toBeTruthy();
    });

    it('should be true when the document isAutoGenerated and eventCode is NCNP', () => {
      state.form = {
        eventCode: 'NCNP',
        isAutoGenerated: true,
      };

      const result = runCompute(addDocketEntryHelper, { state });

      expect(result.showFilingPartiesForm).toBeTruthy();
    });
  });
});
