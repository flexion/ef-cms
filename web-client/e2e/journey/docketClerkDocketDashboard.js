import { formattedSectionWorkQueue } from '../../src/presenter/computeds/formattedSectionWorkQueue';
import { runCompute } from 'cerebral/test';

export default test => {
  return it('Docket clerk docket work queue dashboard', async () => {
    let sectionOutboxWorkQueue;
    let answerWorkItem;
    await test.runSequence('gotoDashboardSequence');

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });
    sectionOutboxWorkQueue = test.getState('workQueue');
    answerWorkItem = sectionOutboxWorkQueue.find(
      workItem => workItem.workItemId === test.answerWorkItemId,
    );
    expect(answerWorkItem.messages[0]).toMatchObject({
      message: 'this is a new thread test message',
    });

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
      message: 'Stipulated Decision filed by Respondent is ready for review.',
    });

    sectionOutboxWorkQueue = test.getState('workQueue');
    answerWorkItem = sectionOutboxWorkQueue.find(
      workItem => workItem.workItemId === test.answerWorkItemId,
    );
    expect(answerWorkItem.messages[0]).toMatchObject({
      message: 'this is a new thread test message',
    });

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'section',
    });
    sectionOutboxWorkQueue = test.getState('workQueue');
    answerWorkItem = sectionOutboxWorkQueue.find(
      workItem => workItem.workItemId === test.answerWorkItemId,
    );
    expect(answerWorkItem.messages[0]).toMatchObject({
      message: 'this is a new thread test message',
    });

    const formatted = runCompute(formattedSectionWorkQueue, {
      state: test.getState(),
    });
    expect(formatted[0].createdAtFormatted).toBeDefined();
    expect(formatted[0].docketNumberWithSuffix).toEqual(
      `${test.docketNumber}W`,
    );
    expect(formatted[0].messages[0].createdAtFormatted).toBeDefined();

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
  });
};
