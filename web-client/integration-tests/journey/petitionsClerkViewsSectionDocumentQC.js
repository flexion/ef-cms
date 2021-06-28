import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../../src/presenter/computeds/workQueueHelper';

const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

export const petitionsClerkViewsSectionDocumentQC = (
  integrationTest,
  storeCount,
) => {
  return it('Petitions clerk views Section Document QC', async () => {
    await integrationTest.runSequence('navigateToPathSequence', {
      path: '/document-qc/section/inbox',
    });
    const workQueueToDisplay = integrationTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inbox');

    if (storeCount) {
      const helper = await runCompute(workQueueHelper, {
        state: integrationTest.getState(),
      });
      integrationTest.petitionsClerkSectionDocumentQCInboxCount =
        helper.sectionInboxCount;
    }
  });
};
