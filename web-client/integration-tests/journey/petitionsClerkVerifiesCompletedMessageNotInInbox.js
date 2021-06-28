export const petitionsClerkVerifiesCompletedMessageNotInInbox =
  integrationTest => {
    return it('petitions clerk verifies the completed message is not in their inbox', async () => {
      await integrationTest.runSequence('gotoMessagesSequence', {
        box: 'inbox',
        queue: 'my',
      });

      const messages = integrationTest.getState('messages');

      const foundMessage = messages.find(
        message => message.subject === integrationTest.testMessageSubject,
      );

      expect(foundMessage).toBeUndefined();
    });
  };
