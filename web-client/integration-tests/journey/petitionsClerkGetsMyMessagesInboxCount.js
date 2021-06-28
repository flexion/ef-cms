import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../../src/presenter/computeds/workQueueHelper';

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

export const petitionsClerkGetsMyMessagesInboxCount = (
  integrationTest,
  adjustExpectedCountBy = 0,
) => {
  return it('Petitions clerk gets My Messages Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: integrationTest.getState(),
    });
    if (integrationTest.petitionsClerkMyMessagesInboxCount != null) {
      expect(helper.inboxCount).toEqual(
        integrationTest.petitionsClerkMyMessagesInboxCount +
          adjustExpectedCountBy,
      );
    } else {
      expect(helper.inboxCount).toBeGreaterThan(0);
    }
  });
};
