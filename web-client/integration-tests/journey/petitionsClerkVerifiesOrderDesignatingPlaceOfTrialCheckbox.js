import { CaseInternal } from '../../../shared/src/business/entities/cases/CaseInternal';

export const petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox = (
  integrationTest,
  fakeFile,
) => {
  return it('Petitions clerk verifies that the Order Designating Place of Trial checkbox is correctly checked and unchecked', async () => {
    await integrationTest.runSequence('gotoStartCaseWizardSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'StartCaseInternal',
    );

    expect(
      integrationTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeTruthy();

    await integrationTest.runSequence(
      'updateOrderForDesignatingPlaceOfTrialSequence',
      {
        key: 'orderDesignatingPlaceOfTrial',
        value: false,
      },
    );

    await integrationTest.runSequence('submitPetitionFromPaperSequence');

    expect(integrationTest.getState('validationErrors')).toMatchObject({
      chooseAtLeastOneValue:
        CaseInternal.VALIDATION_ERROR_MESSAGES.chooseAtLeastOneValue,
    });

    await integrationTest.runSequence(
      'updateOrderForDesignatingPlaceOfTrialSequence',
      {
        key: 'orderDesignatingPlaceOfTrial',
        value: true,
      },
    );

    await integrationTest.runSequence(
      'updateOrderForDesignatingPlaceOfTrialSequence',
      {
        key: 'preferredTrialCity',
        value: 'Boise, Idaho',
      },
    );

    expect(
      integrationTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeFalsy();

    await integrationTest.runSequence(
      'updateOrderForDesignatingPlaceOfTrialSequence',
      {
        key: 'preferredTrialCity',
        value: '',
      },
    );

    expect(
      integrationTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeTruthy();

    // simulate switching to RQT document tab
    await integrationTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'currentViewMetadata.documentSelectedForScan',
      value: 'requestForPlaceOfTrialFile',
    });

    await integrationTest.runSequence('setDocumentUploadModeSequence', {
      documentUploadMode: 'upload',
    });

    await integrationTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'requestForPlaceOfTrialFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(
      integrationTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeFalsy();

    await integrationTest.runSequence('openConfirmDeletePDFModalSequence');

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'ConfirmDeletePDFModal',
    );

    await integrationTest.runSequence('removeScannedPdfSequence');

    expect(
      integrationTest.getState('form.requestForPlaceOfTrialFile'),
    ).toBeUndefined();
    expect(
      integrationTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeTruthy();

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'orderDesignatingPlaceOfTrial',
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

    expect(
      integrationTest.getState('form.orderDesignatingPlaceOfTrial'),
    ).toBeFalsy();
  });
};
