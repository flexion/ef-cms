import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);
const JUDGES_CHAMBERS = applicationContext
  .getPersistenceGateway()
  .getJudgesChambers();

export const userSendsMessageToJudge = (integrationTest, subject) => {
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: integrationTest.getState(),
    });
  };

  return it('internal user sends message to judgeColvin', async () => {
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
      value: 'dabbad00-18d0-43ec-bafb-654e83405416', //judgeColvin
    });

    const messageDocument = getHelper().documents[0];
    integrationTest.testMessageDocumentId = messageDocument.docketEntryId;

    await integrationTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: messageDocument.docketEntryId,
    });

    expect(integrationTest.getState('modal.form.subject')).toEqual(
      messageDocument.documentTitle || messageDocument.documentType,
    );

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: subject,
    });

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: "don't forget to be awesome",
    });

    await integrationTest.runSequence('createMessageSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
