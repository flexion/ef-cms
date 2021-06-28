import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../../src/presenter/computeds/workQueueHelper';

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

export const petitionsClerkGetsSectionDocumentQCInboxCount = (
  integrationTest,
  adjustExpectedCountBy = 0,
) => {
  return it('Petitions clerk gets Section Document QC Inbox case count', async () => {
    const helper = await runCompute(workQueueHelper, {
      state: integrationTest.getState(),
    });
    if (
      integrationTest.petitionsClerkSectionDocumentQCInboxCount !== undefined
    ) {
      expect(helper.sectionInboxCount).toEqual(
        integrationTest.petitionsClerkSectionDocumentQCInboxCount +
          adjustExpectedCountBy,
      );
    } else {
      expect(helper.sectionInboxCount).toBeGreaterThan(0);
    }
  });
};
