import { runCompute } from 'cerebral/test';

import { formattedSectionWorkQueue } from '../../src/presenter/computeds/formattedSectionWorkQueue';

export default test => {
  return it('Docket clerk docket work queue dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const sectionWorkQueue = test.getState('workQueue');
    expect(sectionWorkQueue.length).toBeGreaterThanOrEqual(2);
    const workItem = sectionWorkQueue.find(
      workItem =>
        workItem.docketNumber === test.docketNumber &&
        workItem.document.documentType === 'Stipulated Decision',
    );
    expect(workItem).toBeDefined();
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;

    expect(workItem.messages[0]).toMatchObject({
      from: 'Test Respondent',
      fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'A Stipulated Decision filed by Respondent is ready for review.',
    });

    const formatted = runCompute(formattedSectionWorkQueue, {
      state: test.getState(),
    });
    expect(formatted[0].createdAtFormatted).toBeDefined();
    expect(formatted[0].docketNumberWithSuffix).toEqual(
      `${test.docketNumber}W`,
    );
    expect(formatted[0].messages[0].createdAtFormatted).toBeDefined();
  });
};
