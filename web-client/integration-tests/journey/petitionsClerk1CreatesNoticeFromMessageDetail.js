export const petitionsClerk1CreatesNoticeFromMessageDetail =
  integrationTest => {
    return it('petitions clerk 1 creates notice from message detail', async () => {
      const { messageId } = integrationTest.getState('messageDetail')[0];
      await integrationTest.runSequence(
        'openCreateOrderChooseTypeModalSequence',
        {
          parentMessageId: integrationTest.parentMessageId,
        },
      );

      expect(integrationTest.getState('modal.showModal')).toBe(
        'CreateOrderChooseTypeModal',
      );

      await integrationTest.runSequence(
        'updateCreateOrderModalFormValueSequence',
        {
          key: 'eventCode',
          value: 'NOT',
        },
      );

      await integrationTest.runSequence(
        'updateCreateOrderModalFormValueSequence',
        {
          key: 'documentTitle',
          value: 'A Notice Created From A Message',
        },
      );

      expect(integrationTest.getState('validationErrors')).toEqual({});

      await integrationTest.runSequence('submitCreateOrderModalSequence');

      await integrationTest.runSequence('gotoCreateOrderSequence', {
        docketNumber: integrationTest.docketNumber,
        documentTitle: integrationTest.getState('modal.documentTitle'),
        documentType: integrationTest.getState('modal.documentType'),
        eventCode: integrationTest.getState('modal.eventCode'),
        redirectUrl: `/messages/${integrationTest.docketNumber}/message-detail/${integrationTest.parentMessageId}`,
      });

      expect(integrationTest.getState('currentPage')).toBe('CreateOrder');

      await integrationTest.runSequence('submitCourtIssuedOrderSequence');

      expect(integrationTest.getState('currentPage')).toBe('MessageDetail');
      const messageDetail = integrationTest.getState('messageDetail');
      expect(messageDetail[0].messageId).toBe(messageId);
    });
  };
