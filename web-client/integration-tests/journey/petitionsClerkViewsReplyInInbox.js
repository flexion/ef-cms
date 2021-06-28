export const petitionsClerkViewsReplyInInbox = integrationTest => {
  return it('petitions clerk views the reply they were sent in their inbox', async () => {
    await integrationTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = integrationTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === integrationTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
    expect(foundMessage.from).toEqual('Test Petitionsclerk1');
  });
};
