import { runCompute } from 'cerebral/test';

import { CATEGORY_MAP } from '../../../../shared/src/business/entities/Document';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { PARTY_TYPES } from '../../../../shared/src/business/entities/contacts/PetitionContact';

const state = {
  caseDetail: MOCK_CASE,
  constants: {
    CATEGORY_MAP,
    PARTY_TYPES,
  },
  form: {},
  validationErrors: {},
};

import { fileDocumentHelper } from './fileDocumentHelper';

describe('fileDocumentHelper', () => {
  beforeEach(() => {
    state.form = {};
  });

  it('returns correct values when documentType is undefined', async () => {
    let testState = { ...state, form: { documentType: undefined } };

    const expected = {
      isSecondaryDocumentUploadOptional: false,
      showObjection: false,
      showPrimaryDocumentValid: false,
      showSecondaryDocumentValid: false,
      showSecondaryParty: false,
    };

    const result = await runCompute(fileDocumentHelper, {
      state: testState,
    });
    expect(result).toMatchObject(expected);
    expect(Array.isArray(result.supportingDocumentTypeList)).toBeTruthy();
  });

  it('returns a correctly-formatted list of supporting documents', async () => {
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.supportingDocumentTypeList.length > 0).toBeTruthy();

    expect(
      result.supportingDocumentTypeList[0].documentTypeDisplay,
    ).not.toMatch('in Support');
  });

  it('has optional secondary document upload when motion for leave to file', async () => {
    state.form = { documentType: 'Motion for Leave to File' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.isSecondaryDocumentUploadOptional).toBeTruthy();
  });

  it('shows objection if document type is a motion', async () => {
    state.form = { documentType: 'Motion for Leave to File' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showObjection).toBeTruthy();
  });

  it('indicates file uploads are valid', async () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      primaryDocumentFile: { some: 'file' },
      secondaryDocumentFile: { some: 'file' },
    };

    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
    expect(result.showSecondaryDocumentValid).toBeTruthy();
  });

  it('shows secondary party for petionerSpouse or petitionerDeceasedSpouse', async () => {
    state.caseDetail.partyType = PARTY_TYPES.petitionerSpouse;
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showSecondaryParty).toBeTruthy();
  });

  it('generates correctly formatted service date', async () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/2012');
  });

  it('does not generate a formatted service date if a service date is not entered on the form', async () => {
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toBeUndefined();
  });

  it('shows Filing Includes on review page if certificateOfService is true', async () => {
    state.form.certificateOfService = true;
    state.form.certificateOfServiceDate = '2018-01-01';
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showFilingIncludes).toEqual(true);
  });

  it('does not show Filing Includes if certOfService, exhibits, and attachments are all false', async () => {
    state.form.certificateOfService = false;
    state.form.attachments = false;
    state.form.exhibits = false;
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showFilingIncludes).toEqual(false);
  });

  it('shows Filing Does Not Include if exhibits is false', async () => {
    state.form.exhibits = false;
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(true);
  });

  it('does not show Filing Does Not Include if certOfService, exhibits, attachments, and hasSupportingDocuments are all true', async () => {
    state.form.certificateOfService = true;
    state.form.attachments = true;
    state.form.exhibits = true;
    state.form.hasSupportingDocuments = true;
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showFilingNotIncludes).toEqual(false);
  });

  it('does not show party validation error if none of the party validation errors exists', async () => {
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.partyValidationError).toBeUndefined();
  });

  it('shows party validation error if any one of the party validation errors exists', async () => {
    state.validationErrors = { partyPrimary: 'You did something bad.' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  it('shows practitioner option under Parties Filing for user role practitioner', async () => {
    state.user = { role: 'practitioner' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showPractitionerParty).toBeTruthy();
  });

  it('does not show practitioner option under Parties Filing for user role petitioner', async () => {
    state.user = { role: 'petitioner' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showPractitionerParty).toBeFalsy();
  });

  it('does not show respondent option under Parties Filing if respondent is not associated with case', async () => {
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showRespondentParty).toBeFalsy();
  });

  it('shows respondent option under Parties Filing if respondent is associated with case', async () => {
    state.caseDetail.respondent = { name: 'Test Respondent' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.showRespondentParty).toBeTruthy();
  });

  it('shows Myself as party primary label for user role petitioner', async () => {
    state.user = { role: 'petitioner' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.partyPrimaryLabel).toEqual('Myself');
  });

  it('shows primary contact name as party primary label for user role practitioner', async () => {
    state.user = { role: 'practitioner' };
    const result = await runCompute(fileDocumentHelper, { state });
    expect(result.partyPrimaryLabel).toEqual('Test Taxpayer');
  });

  describe('supporting document', () => {
    beforeEach(() => {
      state.form.hasSupportingDocuments = true;
      state.form.hasSecondarySupportingDocuments = true;
    });

    it('not shown if no type selected', async () => {
      state.form.supportingDocument = '';
      const result = await runCompute(fileDocumentHelper, { state });
      expect(result.showSupportingDocumentFreeText).toBeFalsy();
      expect(result.showSupportingDocumentUpload).toBeFalsy();
    });

    it('upload file is shown when supporting type is not empty', async () => {
      state.form.supportingDocument = 'Some Document Type';
      const result = await runCompute(fileDocumentHelper, { state });
      expect(result.showSupportingDocumentFreeText).toBeFalsy();
      expect(result.showSupportingDocumentUpload).toBeTruthy();
    });

    it('upload file and signature are shown for type Affidavit in Support', async () => {
      state.form.supportingDocument = 'Affidavit in Support';
      const result = await runCompute(fileDocumentHelper, { state });
      expect(result.showSupportingDocumentFreeText).toBeTruthy();
      expect(result.showSupportingDocumentUpload).toBeTruthy();
    });

    describe('for secondary supporting document', () => {
      it('not shown if no type selected', async () => {
        state.form.secondarySupportingDocument = '';
        const result = await runCompute(fileDocumentHelper, { state });
        expect(result.showSecondarySupportingDocumentFreeText).toBeFalsy();
        expect(result.showSecondarySupportingDocumentUpload).toBeFalsy();
      });

      it('upload file is shown when supporting type is not empty', async () => {
        state.form.secondarySupportingDocument = 'Declaration of Undying Love';
        const result = await runCompute(fileDocumentHelper, { state });
        expect(result.showSecondarySupportingDocumentFreeText).toBeFalsy();
        expect(result.showSecondarySupportingDocumentUpload).toBeTruthy();
      });

      it('upload file and signature are shown for type Affidavit in Support', async () => {
        state.form.secondarySupportingDocument = 'Affidavit in Support';
        const result = await runCompute(fileDocumentHelper, { state });
        expect(result.showSecondarySupportingDocumentFreeText).toBeTruthy();
        expect(result.showSecondarySupportingDocumentUpload).toBeTruthy();
      });
    });
  });
});
