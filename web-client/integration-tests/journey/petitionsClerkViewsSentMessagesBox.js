export const petitionsClerkViewsSentMessagesBox = integrationTest => {
  return it('petitions clerk views their sent messages box', async () => {
    await integrationTest.runSequence('gotoMessagesSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const messages = integrationTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === integrationTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
  });
};
