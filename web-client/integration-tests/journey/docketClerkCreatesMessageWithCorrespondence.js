import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const JUDGES_CHAMBERS = applicationContext
  .getPersistenceGateway()
  .getJudgesChambers();
const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const docketClerkCreatesMessageWithCorrespondence = integrationTest => {
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: integrationTest.getState(),
    });
  };

  it('docketclerk creates a message with correspondence document attached', async () => {
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

    const correspondence = getHelper().correspondence.find(
      c =>
        c.correspondenceId ===
        integrationTest.correspondenceDocument.correspondenceId,
    );

    await integrationTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: correspondence.correspondenceId,
    });

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'are we human?',
    });

    await integrationTest.runSequence('createMessageSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
