export const docketClerkServesDocumentFromCaseDetailDocumentView =
  integrationTest => {
    return it('Docketclerk serves document from case detail document view', async () => {
      await integrationTest.runSequence(
        'openConfirmServeCourtIssuedDocumentSequence',
        {
          docketEntryId: integrationTest.docketEntryId,
          redirectUrl: `/case-detail/${integrationTest.docketNumber}/document-view?docketEntryId=${integrationTest.docketEntryId}`,
        },
      );

      expect(integrationTest.getState('modal.showModal')).toEqual(
        'ConfirmInitiateCourtIssuedDocumentServiceModal',
      );

      await integrationTest.runSequence('serveCourtIssuedDocumentSequence');

      expect(integrationTest.getState('alertSuccess')).toEqual({
        message: 'Document served. ',
      });

      expect(
        integrationTest.getState(
          'currentViewMetadata.caseDetail.docketRecordTab',
        ),
      ).toEqual('documentView');
    });
  };
