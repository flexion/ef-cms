import { applicationContextForClient as applicationContext } from '../../../shared/src/business//test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const JUDGES_CHAMBERS = applicationContext
  .getPersistenceGateway()
  .getJudgesChambers();
const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const petitionsClerkCreatesMessageToChambers = integrationTest => {
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: integrationTest.getState(),
    });
  };

  return it('Petitions clerk sends a message to colvinsChambers', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('openCreateMessageModalSequence');

    await integrationTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: JUDGES_CHAMBERS.COLVINS_CHAMBERS_SECTION.section,
      },
    );

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '9c9292a4-2d5d-45b1-b67f-ac0e1c9b5df5', //colvinsChambers
    });

    const messageDocument = getHelper().documents[0];
    integrationTest.testMessageDocumentId = messageDocument.docketEntryId;

    await integrationTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: messageDocument.docketEntryId,
    });

    expect(integrationTest.getState('modal.form.subject')).toEqual(
      messageDocument.documentTitle || messageDocument.documentType,
    );

    integrationTest.testMessageSubject = `hi chambers! ${Date.now()}`;

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: integrationTest.testMessageSubject,
    });

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'how ya doin?',
    });

    await integrationTest.runSequence('createMessageSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
