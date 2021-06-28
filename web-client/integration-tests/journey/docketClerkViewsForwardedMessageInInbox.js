export const docketClerkViewsForwardedMessageInInbox = integrationTest => {
  return it('docket clerk views the forwarded message they were sent in their inbox', async () => {
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
  });
};
