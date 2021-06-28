export const petitionsClerk1ServesDocumentFromMessageDetail =
  integrationTest => {
    return it('petitions clerk 1 serves document from message detail', async () => {
      await integrationTest.runSequence(
        'openConfirmServePaperFiledDocumentSequence',
        {
          docketEntryId: integrationTest.docketEntryId,
          redirectUrl: `/messages/${integrationTest.docketNumber}/message-detail/${integrationTest.parentMessageId}`,
        },
      );

      expect(integrationTest.getState('redirectUrl')).toBe(
        `/messages/${integrationTest.docketNumber}/message-detail/${integrationTest.parentMessageId}`,
      );
      expect(integrationTest.getState('docketEntryId')).toBe(
        integrationTest.docketEntryId,
      );

      expect(integrationTest.getState('modal.showModal')).toBe(
        'ConfirmInitiatePaperDocumentServiceModal',
      );

      await integrationTest.setState('iframeSrc', undefined);

      await integrationTest.runSequence('serveCourtIssuedDocumentSequence', {});

      expect(integrationTest.getState('alertSuccess')).toEqual({
        message: 'Document served. ',
      });
      expect(integrationTest.getState('currentPage')).toBe('MessageDetail');

      expect(integrationTest.getState('iframeSrc')).not.toBeUndefined();
    });
  };
