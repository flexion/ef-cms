export const docketClerkEditsSignedUploadedCourtIssuedDocument = (
  integrationTest,
  fakeFile,
) => {
  return it('Docket Clerk edits a signed uploaded court issued document', async () => {
    await integrationTest.runSequence('openConfirmEditModalSequence', {
      docketEntryIdToEdit: integrationTest.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('navigateToEditOrderSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'EditUploadCourtIssuedDocument',
    );

    await integrationTest.runSequence('clearExistingDocumentSequence');

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('editUploadCourtIssuedDocumentSequence', {
      tab: 'drafts',
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const caseDocument = integrationTest
      .getState('caseDetail.docketEntries')
      .find(d => d.docketEntryId === integrationTest.docketEntryId);
    expect(caseDocument.signedAt).toEqual(null);
  });
};
