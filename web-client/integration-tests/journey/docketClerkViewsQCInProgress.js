import { wait } from '../helpers';

export default (test, shouldExist) => {
  return it('Docket clerk views My Document QC - In Progress', async () => {
    await test.runSequence('gotoMessagesSequence');
    expect(test.getState('currentPage')).toEqual('Messages');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'my',
      workQueueIsInternal: false,
    });

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.workQueueIsInternal).toBeFalsy();
    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const inProgressQueue = test.getState('workQueue');
    console.log(''); // adding this causes the tests to pass....
    const inProgressWorkItem = inProgressQueue.find(
      workItem =>
        workItem.document.documentId === test.docketRecordEntry.documentId,
    );
    if (shouldExist) {
      expect(inProgressWorkItem).toBeTruthy();
    } else {
      expect(inProgressWorkItem).toBeFalsy();
    }
  });
};
