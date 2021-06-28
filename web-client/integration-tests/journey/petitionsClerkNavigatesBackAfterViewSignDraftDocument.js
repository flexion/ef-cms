export const petitionsClerkNavigatesBackAfterViewSignDraftDocument =
  integrationTest => {
    return it('Petitions clerk views sign draft document and navigates back to draft documents', async () => {
      await integrationTest.runSequence('gotoSignOrderSequence', {
        docketEntryId: integrationTest.docketEntryId,
        docketNumber: integrationTest.docketNumber,
      });

      expect(integrationTest.getState('currentPage')).toEqual('SignOrder');

      await integrationTest.runSequence(
        'navigateToCaseDetailWithDraftDocumentSequence',
        {
          primaryTab: 'draftDocuments',
          viewerDraftDocumentToDisplay: {
            docketEntryId: integrationTest.docketEntryId,
          },
        },
      );

      expect(
        integrationTest.getState('currentViewMetadata.caseDetail.primaryTab'),
      ).toEqual('drafts');
    });
  };
