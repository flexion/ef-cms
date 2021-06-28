export const adcsSignsProposedStipulatedDecisionFromMessage =
  integrationTest => {
    return it('adc signs the proposed stipulated decision from message', async () => {
      await integrationTest.runSequence('gotoMessagesSequence', {
        box: 'inbox',
        queue: 'my',
      });

      const messages = integrationTest.getState('messages');

      const foundMessage = messages.find(
        message => message.subject === integrationTest.testMessageSubject,
      );

      expect(foundMessage).toBeDefined();
      expect(foundMessage.attachments.length).toEqual(1);

      await integrationTest.runSequence('gotoMessageDetailSequence', {
        docketNumber: integrationTest.docketNumber,
        parentMessageId: foundMessage.parentMessageId,
      });
      expect(integrationTest.getState('currentPage')).toEqual('MessageDetail');

      await integrationTest.runSequence('gotoSignOrderSequence', {
        docketEntryId: integrationTest.proposedStipDecisionDocketEntryId,
        docketNumber: integrationTest.docketNumber,
        parentMessageId: foundMessage.parentMessageId,
        redirectUrl: `/messages/${integrationTest.docketNumber}/message-detail/${foundMessage.parentMessageId}?docketEntryId=${integrationTest.proposedStipDecisionDocketEntryId}`,
      });
      expect(integrationTest.getState('currentPage')).toEqual('SignOrder');

      await integrationTest.runSequence('setPDFSignatureDataSequence', {
        signatureData: {
          scale: 1,
          x: 100,
          y: 100,
        },
      });
      await integrationTest.runSequence('saveDocumentSigningSequence');

      expect(integrationTest.getState('currentPage')).toEqual('MessageDetail');
      expect(
        integrationTest.getState('messageDetail.0.attachments').length,
      ).toEqual(2);
      integrationTest.stipDecisionDocketEntryId = integrationTest.getState(
        'messageDetail.0.attachments.1.documentId',
      );
    });
  };
