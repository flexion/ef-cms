import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';

export const petitionsClerkRemovesAndReaddsPdfFromPetition = (
  integrationTest,
  fakeFile,
) => {
  const documentToRemoveAndReAdd = 'applicationForWaiverOfFilingFeeFile';
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  return it('Petitions Clerk removes and readds PDF from petition', async () => {
    integrationTest.setState(
      'currentViewMetadata.documentSelectedForPreview',
      documentToRemoveAndReAdd,
    );
    await integrationTest.runSequence('setDocumentForPreviewSequence');

    const docketEntryIdToDelete = integrationTest.getState('docketEntryId');
    expect(docketEntryIdToDelete).toBeDefined();
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();

    await integrationTest.runSequence('deleteUploadedPdfSequence');

    const deletedDocument = integrationTest
      .getState('form.docketEntries')
      .find(doc => doc.docketEntryId === docketEntryIdToDelete);
    expect(deletedDocument).toBeUndefined();
    expect(integrationTest.getState('pdfPreviewUrl')).toBeUndefined();

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      applicationForWaiverOfFilingFeeFile:
        'Upload or scan an Application for Waiver of Filing Fee (APW)',
    });

    expect(integrationTest.getState('form.docketEntries')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ documentType: 'Petition', eventCode: 'P' }),
      ]),
    );

    await integrationTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'applicationForWaiverOfFilingFeeFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(
      integrationTest.getState('form')[documentToRemoveAndReAdd],
    ).toBeDefined();

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    const newApwFileDocketEntryId = integrationTest
      .getState('caseDetail.docketEntries')
      .find(
        doc =>
          doc.eventCode ===
          INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
      );
    expect(newApwFileDocketEntryId).not.toBe(docketEntryIdToDelete);
  });
};
