export const petitionsClerk1ViewsMessageInbox = integrationTest => {
  return it('petitions clerk 1 views their messages inbox', async () => {
    await integrationTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = integrationTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === integrationTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();

    integrationTest.testMessageDocumentId =
      foundMessage.attachments[0].documentId;
    integrationTest.parentMessageId = foundMessage.parentMessageId;

    expect(integrationTest.getState('messagesSectionCount')).toBeGreaterThan(0);
    expect(integrationTest.getState('messagesInboxCount')).toBeGreaterThan(0);
  });
};
