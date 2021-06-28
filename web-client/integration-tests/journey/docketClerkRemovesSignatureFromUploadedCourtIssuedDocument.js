export const docketClerkRemovesSignatureFromUploadedCourtIssuedDocument =
  integrationTest => {
    return it('Docket Clerk removes signature from an uploaded court issued document', async () => {
      await integrationTest.runSequence(
        'openConfirmRemoveSignatureModalSequence',
        {
          docketEntryIdToEdit: integrationTest.docketEntryId,
        },
      );

      await integrationTest.runSequence('removeSignatureSequence');

      expect(integrationTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );

      const caseDocument = integrationTest
        .getState('caseDetail.docketEntries')
        .find(d => d.docketEntryId === integrationTest.docketEntryId);

      expect(caseDocument.signedAt).toEqual(null);
    });
  };
