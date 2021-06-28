import { formattedCaseMessages as formattedCaseMessagesComputed } from '../../src/presenter/computeds/formattedCaseMessages';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseMessages = withAppContextDecorator(
  formattedCaseMessagesComputed,
);

export const docketClerkViewsCompletedMessagesOnCaseDetail =
  integrationTest => {
    return it('docket clerk views completed messages on the case detail page', async () => {
      await integrationTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: integrationTest.docketNumber,
      });

      expect(integrationTest.getState('caseDetail.messages').length).toEqual(4);

      const messagesFormatted = runCompute(formattedCaseMessages, {
        state: integrationTest.getState(),
      });
      expect(messagesFormatted.inProgressMessages.length).toEqual(1);
      expect(messagesFormatted.completedMessages.length).toEqual(1);
    });
  };
