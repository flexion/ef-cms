export const petitionsClerkViewsRepliesAndCompletesMessageInInbox =
  integrationTest => {
    return it('petitions clerk views, replies, and completes messsage in inbox', async () => {
      await integrationTest.runSequence('gotoMessagesSequence', {
        box: 'inbox',
        queue: 'my',
      });

      const messages = integrationTest.getState('messages');

      const foundMessage = messages.find(
        message => message.subject === integrationTest.testMessageSubject,
      );

      expect(foundMessage).toBeDefined();
      expect(foundMessage.from).toEqual('Test Petitionsclerk');

      integrationTest.parentMessageId = foundMessage.parentMessageId;

      await integrationTest.runSequence('gotoMessageDetailSequence', {
        docketNumber: integrationTest.docketNumber,
        parentMessageId: integrationTest.parentMessageId,
      });

      await integrationTest.runSequence('openReplyToMessageModalSequence');

      expect(integrationTest.getState('modal.form')).toMatchObject({
        parentMessageId: integrationTest.parentMessageId,
        subject: integrationTest.testMessageSubject,
        to: 'Test Petitionsclerk',
      });

      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'form.message',
        value: 'Millions of families suffer from it every year.',
      });

      await integrationTest.runSequence('replyToMessageSequence');

      await integrationTest.runSequence('openCompleteMessageModalSequence');

      await integrationTest.runSequence('updateModalValueSequence', {
        key: 'form.message',
        value: 'Win, Win win no matter what',
      });

      await integrationTest.runSequence('completeMessageSequence');
    });
  };
