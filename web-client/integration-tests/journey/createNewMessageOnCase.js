import { NewMessage } from '../../../shared/src/business/entities/NewMessage';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business//test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { PETITIONS_SECTION } = applicationContext.getConstants();

const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const createNewMessageOnCase = integrationTest => {
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: integrationTest.getState(),
    });
  };

  return it('user creates new message on a case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('openCreateMessageModalSequence');

    await integrationTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: PETITIONS_SECTION,
      },
    );

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '4805d1ab-18d0-43ec-bafb-654e83405416', //petitionsclerk1
    });

    const messageDocument = getHelper().documents[0];
    integrationTest.testMessageDocumentId = messageDocument.docketEntryId;

    await integrationTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: integrationTest.testMessageDocumentId,
    });

    expect(integrationTest.getState('modal.form.subject')).toEqual(
      messageDocument.documentTitle || messageDocument.documentType,
    );

    integrationTest.testMessageSubject = `what kind of bear is best? ${Date.now()}`;

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: integrationTest.testMessageSubject,
    });

    await integrationTest.runSequence('createMessageSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      message: NewMessage.VALIDATION_ERROR_MESSAGES.message[0].message,
    });

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'bears, beets, battlestar galactica',
    });

    await integrationTest.runSequence('createMessageSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
