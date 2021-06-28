export const petitionsClerkVerifiesCompletedMessageNotInSection =
  integrationTest => {
    return it('petitions clerk verifies the completed message is not in the section inbox', async () => {
      await integrationTest.runSequence('gotoMessagesSequence', {
        box: 'inbox',
        queue: 'section',
      });

      const messages = integrationTest.getState('messages');

      const foundMessage = messages.find(
        message => message.subject === integrationTest.testMessageSubject,
      );

      expect(foundMessage).toBeUndefined();
    });
  };
