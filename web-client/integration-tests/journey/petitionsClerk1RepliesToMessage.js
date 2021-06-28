import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerk1RepliesToMessage = integrationTest => {
  return it('petitions clerk 1 replies to the message they received', async () => {
    await integrationTest.runSequence('openReplyToMessageModalSequence');

    expect(integrationTest.getState('modal.form')).toMatchObject({
      parentMessageId: integrationTest.parentMessageId,
      subject: integrationTest.testMessageSubject,
      to: 'Test Petitionsclerk',
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Identity theft is not a joke, Jim.',
    });

    await integrationTest.runSequence('replyToMessageSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('messageDetail').length).toEqual(2);

    await refreshElasticsearchIndex();

    //message should no longer be shown in inbox
    await integrationTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = integrationTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === integrationTest.testMessageSubject,
    );

    expect(foundMessage).not.toBeDefined();
  });
};
