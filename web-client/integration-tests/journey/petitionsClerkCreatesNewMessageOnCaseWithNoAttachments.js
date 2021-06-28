import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';

const { PETITIONS_SECTION } = applicationContext.getConstants();

export const petitionsClerkCreatesNewMessageOnCaseWithNoAttachments =
  integrationTest => {
    return it('petitions clerk creates new message on a case with no attachments', async () => {
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

      integrationTest.testMessageSubject = `someone poisoned the coffee ${Date.now()}`;

      await integrationTest.runSequence('updateModalFormValueSequence', {
        key: 'subject',
        value: integrationTest.testMessageSubject,
      });

      await integrationTest.runSequence('updateModalFormValueSequence', {
        key: 'message',
        value: 'do not drink the coffee',
      });

      await integrationTest.runSequence('createMessageSequence');

      expect(integrationTest.getState('validationErrors')).toEqual({});

      await refreshElasticsearchIndex();
    });
  };
