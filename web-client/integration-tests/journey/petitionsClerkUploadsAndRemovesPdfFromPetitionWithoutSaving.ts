import { fakeBlob1 } from '../../../shared/src/business/test/getFakeFile';

export const petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving =
  cerebralTest => {
    const applicationForWaiverOfFilingFeeFile =
      'applicationForWaiverOfFilingFeeFile';
    const documentToRemoveAndReAdd = 'stinFile';

    return it('Petitions Clerk uploads and removes pdf from petition without saving', async () => {
      cerebralTest.setState(
        'currentViewMetadata.documentSelectedForPreview',
        applicationForWaiverOfFilingFeeFile,
      );
      await cerebralTest.runSequence('setDocumentForPreviewSequence');

      cerebralTest.setState(
        'currentViewMetadata.documentSelectedForPreview',
        'stinFile',
      );
      await cerebralTest.runSequence('setDocumentForPreviewSequence');

      await cerebralTest.runSequence('setDocumentForUploadSequence', {
        documentUploadMode: 'preview',
        file: fakeBlob1,
        locationOnForm: documentToRemoveAndReAdd,
      });

      expect(
        cerebralTest.getState('form')[documentToRemoveAndReAdd],
      ).toBeDefined();

      expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();
      expect(
        cerebralTest.getState('currentViewMetadata.documentSelectedForPreview'),
      ).toBe(documentToRemoveAndReAdd);

      await cerebralTest.runSequence('deleteUploadedPdfSequence');

      expect(cerebralTest.getState('pdfPreviewUrl')).toBeUndefined();
      expect(
        cerebralTest.getState('form')[documentToRemoveAndReAdd],
      ).toBeUndefined();

      cerebralTest.setState(
        'currentViewMetadata.documentSelectedForPreview',
        applicationForWaiverOfFilingFeeFile,
      );
      await cerebralTest.runSequence('setDocumentForPreviewSequence');
      expect(cerebralTest.getState('form.docketEntries')).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            documentType: 'Application for Waiver of Filing Fee',
          }),
        ]),
      );

      await cerebralTest.runSequence('saveSavedCaseForLaterSequence');
    });
  };
