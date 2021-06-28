import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';
import { PARTY_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkVerifiesOrderForOdsCheckbox = (
  integrationTest,
  fakeFile,
) => {
  return it('Petitions clerk verifies that the Order for ODS checkbox is correctly checked and unchecked', async () => {
    await integrationTest.runSequence('gotoStartCaseWizardSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'StartCaseInternal',
    );

    await integrationTest.runSequence(
      'updateStartCaseInternalPartyTypeSequence',
      {
        key: 'partyType',
        value: PARTY_TYPES.petitioner,
      },
    );

    expect(integrationTest.getState('form.orderForOds')).toBeFalsy();

    await integrationTest.runSequence(
      'updateStartCaseInternalPartyTypeSequence',
      {
        key: 'partyType',
        value: PARTY_TYPES.corporation,
      },
    );

    expect(integrationTest.getState('form.orderForOds')).toBeTruthy();

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      integrationTest.getState('validationErrors.ownershipDisclosureFile'),
    ).toBeUndefined();

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'orderForOds',
      value: false,
    });

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(
      integrationTest.getState('validationErrors.ownershipDisclosureFile'),
    ).toEqual(CaseInternal.VALIDATION_ERROR_MESSAGES.ownershipDisclosureFile);

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'orderForOds',
      value: true,
    });

    // simulate switching to ODS document tab
    await integrationTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'currentViewMetadata.documentSelectedForScan',
      value: 'ownershipDisclosureFile',
    });

    await integrationTest.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'upload',
    });

    await integrationTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'ownershipDisclosureFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(integrationTest.getState('form.orderForOds')).toBeFalsy();

    await integrationTest.runSequence('openConfirmDeletePDFModalSequence');

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'ConfirmDeletePDFModal',
    );

    await integrationTest.runSequence('removeScannedPdfSequence');

    expect(
      integrationTest.getState('form.ownershipDisclosureFile'),
    ).toBeUndefined();
    expect(integrationTest.getState('form.orderForOds')).toBeTruthy();

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'orderForOds',
      value: false,
    });

    await integrationTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'currentViewMetadata.documentSelectedForScan',
      value: 'petitionFile',
    });

    await integrationTest.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'upload',
    });

    await integrationTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'petitionFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(integrationTest.getState('form.orderForOds')).toBeFalsy();
  });
};
