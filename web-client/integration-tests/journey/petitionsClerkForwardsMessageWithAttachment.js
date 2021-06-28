import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const petitionsClerkForwardsMessageWithAttachment = integrationTest => {
  const { DOCKET_SECTION } = applicationContext.getConstants();
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: integrationTest.getState(),
    });
  };

  return it('petitions clerk forwards the message with an added attachment', async () => {
    await integrationTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = integrationTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === integrationTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();

    await integrationTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: integrationTest.docketNumber,
      parentMessageId: foundMessage.parentMessageId,
    });

    await integrationTest.runSequence('openForwardMessageModalSequence');

    expect(integrationTest.getState('modal.form')).toMatchObject({
      parentMessageId: foundMessage.parentMessageId,
      subject: integrationTest.testMessageSubject,
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'identity theft is not a joke, Jim',
    });

    await integrationTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: DOCKET_SECTION,
      },
    );

    const messageDocument = getHelper().documents[0];
    integrationTest.testMessageDocumentId = messageDocument.docketEntryId;

    await integrationTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: messageDocument.docketEntryId,
    });

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '1805d1ab-18d0-43ec-bafb-654e83405416', //docketclerk
    });

    await integrationTest.runSequence('forwardMessageSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('messageViewerDocumentToDisplay')).toEqual({
      documentId: messageDocument.docketEntryId,
    });
    expect(integrationTest.getState('iframeSrc')).toBeDefined();
  });
};
