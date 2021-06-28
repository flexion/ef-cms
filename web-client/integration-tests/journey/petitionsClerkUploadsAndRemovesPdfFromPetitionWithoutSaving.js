export const petitionsClerkUploadsAndRemovesPdfFromPetitionWithoutSaving = (
  integrationTest,
  fakeFile,
) => {
  const applicationForWaiverOfFilingFeeFile =
    'applicationForWaiverOfFilingFeeFile';
  const documentToRemoveAndReAdd = 'stinFile';

  return it('Petitions Clerk uploads and removes pdf from petition without saving', async () => {
    integrationTest.setState(
      'currentViewMetadata.documentSelectedForPreview',
      applicationForWaiverOfFilingFeeFile,
    );
    await integrationTest.runSequence('setDocumentForPreviewSequence');

    integrationTest.setState(
      'currentViewMetadata.documentSelectedForPreview',
      'stinFile',
    );
    await integrationTest.runSequence('setDocumentForPreviewSequence');

    await integrationTest.runSequence('setDocumentForUploadSequence', {
      documentType: documentToRemoveAndReAdd,
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(
      integrationTest.getState('form')[documentToRemoveAndReAdd],
    ).toBeDefined();

    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();
    expect(
      integrationTest.getState(
        'currentViewMetadata.documentSelectedForPreview',
      ),
    ).toBe(documentToRemoveAndReAdd);

    await integrationTest.runSequence('deleteUploadedPdfSequence');

    expect(integrationTest.getState('pdfPreviewUrl')).toBeUndefined();
    expect(
      integrationTest.getState('form')[documentToRemoveAndReAdd],
    ).toBeUndefined();

    integrationTest.setState(
      'currentViewMetadata.documentSelectedForPreview',
      applicationForWaiverOfFilingFeeFile,
    );
    await integrationTest.runSequence('setDocumentForPreviewSequence');
    expect(integrationTest.getState('form.docketEntries')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentType: 'Application for Waiver of Filing Fee',
        }),
      ]),
    );

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');
  });
};
