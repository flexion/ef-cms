import { runCompute } from 'cerebral/test';

import caseDetailHelper from '../../src/presenter/computeds/caseDetailHelper';

export default test => {
  return xit('Petitions clerk views IRS Holding Queue', async () => {
    // go to the petitions section work queue
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    await test.runSequence('switchWorkQueueSequence', {
      queue: 'section',
      box: 'outbox',
    });
    expect(test.getState('workQueueToDisplay')).toEqual('section');
    // TODO: verify that nothing in the outbox is over 7 days old, we'll need over a week of seed data for this
    expect(test.getState('workQueue.section.outbox').length).toBeGreaterThan(0);
    // the first item in the outbox should be the Petition batched for IRS from the previous test
    expect(test.getState('workQueue.section.outbox.0.status')).toEqual(
      'Batched for IRS',
    );
    // goto the first work item in the section queue outbox, the one we just batched for IRS
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.getState(
        'workQueue.section.outbox.0.document.documentId',
      ),
    });
    const helperBatched = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helperBatched.showCaseDetailsView).toEqual(true);
    expect(helperBatched.showCaseDetailsEdit).toEqual(false);
    expect(helperBatched.showSendToIrsButton).toEqual(false);
    expect(helperBatched.showRecallButton).toEqual(true);

    await test.runSequence('clickRecallPetitionSequence');
    expect(test.getState('showModal')).toEqual('RecallModalDialog');
    await test.runSequence('dismissModalSequence');
    expect(test.getState('showModal')).toEqual('');
    // recall the petition
    await test.runSequence('clickRecallPetitionSequence');
    await test.runSequence('submitRecallPetitionSequence');
    // back on the dashboard
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('workQueue.my.inbox.0.status')).toEqual('Recalled');
    expect(test.getState('workQueue.my.inbox.0.messages.0')).toEqual(
      'Assigned to Petitions Clerk',
    );
    // goto the first work item in the my queue inbox, the one we just recalled
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.getState('workQueue.my.inbox.0.document.documentId'),
    });
    const helperRecalled = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    expect(helperRecalled.showCaseDetailsView).toEqual(false);
    expect(helperRecalled.showCaseDetailsEdit).toEqual(true);
    expect(helperRecalled.showSendToIrsButton).toEqual(true);
    expect(helperRecalled.showRecallButton).toEqual(false);
    // assign to another petitionsclerk
    const workItem = test.getState('workQueue.my.inbox.0');
    await test.runSequence('selectWorkItemSequence', {
      workItem: workItem,
    });
    await test.runSequence('selectAssigneeSequence', {
      assigneeId: 'petitionsclerkXX',
      assigneeName: 'Test Petitionsclerk XX',
    });
    await test.runSequence('assignSelectedWorkItemsSequence');
    // no longer in our inbox!
    expect(test.getState('workQueue.my.inbox.0.docketNumber')).not.toBe(
      test.docketNumber,
    );
  });
};
