import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkForwardsMessageToDocketClerk = integrationTest => {
  const { DOCKET_SECTION } = applicationContext.getConstants();

  return it('petitions clerk forwards the message to docket clerk', async () => {
    await integrationTest.runSequence('openForwardMessageModalSequence');

    expect(integrationTest.getState('modal.form')).toMatchObject({
      parentMessageId: integrationTest.parentMessageId,
      subject: integrationTest.testMessageSubject,
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Four years of malfeasance unreported. This cannot stand.',
    });

    await integrationTest.runSequence('forwardMessageSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      toSection: expect.anything(),
      toUserId: expect.anything(),
    });

    await integrationTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: DOCKET_SECTION,
      },
    );

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '1805d1ab-18d0-43ec-bafb-654e83405416', //docketclerk
    });

    await integrationTest.runSequence('forwardMessageSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('messageDetail').length).toEqual(3);

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
