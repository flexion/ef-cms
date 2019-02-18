import { runCompute } from 'cerebral/test';

import caseDetailHelper from '../../src/presenter/computeds/caseDetailHelper';
import documentDetailHelper from '../../src/presenter/computeds/documentDetailHelper';

export default test => {
  return it('Petitions clerk views IRS Holding Queue', async () => {
    // go to the petitions section work queue
    await test.runSequence('gotoDashboardSequence'); //runs getWorkItemsForSection then set
    //verify that individuals workitems for the inbox are in state

    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });

    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'my',
    });

    //click on Sent/Outbox tab for the section
    await test.runSequence('chooseWorkQueueSequence', {
      //switched from inbox to outbox
      box: 'outbox',
      queue: 'section',
    });

    //verify item in general status older than 7 days does not show
    const oldGeneralItem = test.getState('workQueue').find(item => {
      return item.isInitializeCreate && item.docketNumber === '199-18';
    });

    expect(oldGeneralItem).toBeUndefined();

    //verify that the section workitems are in state
    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'outbox',
      queue: 'section',
    });

    // TODO: verify that nothing in the outbox is over 7 days old, we'll need over a week of seed data for this
    expect(test.getState('workQueue').length).toBeGreaterThan(0);
    // the first item in the outbox should be the Petition batched for IRS from the previous test
    expect(test.getState('workQueue.0.caseStatus')).toEqual('Batched for IRS');
    // goto the first work item in the section queue outbox, the one we just batched for IRS
    const docketNumber = test.getState('workQueue.0.docketNumber');
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.getState('workQueue.0.document.documentId'),
    });

    const caseDetailHelperBatched = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    const documentDetailHelperBatched = runCompute(documentDetailHelper, {
      state: test.getState(),
    });
    expect(documentDetailHelperBatched.showCaseDetailsView).toEqual(true);
    expect(documentDetailHelperBatched.showCaseDetailsEdit).toEqual(false);
    expect(caseDetailHelperBatched.showServeToIrsButton).toEqual(false);
    expect(caseDetailHelperBatched.showRecallButton).toEqual(true);

    // await test.runSequence('clickRecallPetitionSequence');
    // expect(test.getState('showModal')).toEqual('RecallModalDialog');
    // await test.runSequence('dismissModalSequence');
    // expect(test.getState('showModal')).toEqual('');
    // // recall the petition
    // await test.runSequence('clickRecallPetitionSequence');
    await test.runSequence('submitRecallPetitionFromIRSHoldingQueueSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'outbox',
      queue: 'section',
    });

    const generatePromise = (millis, value) => {
      return new Promise(resolve => {
        setTimeout(() => resolve(value), millis);
      });
    };

    await test
      .runSequence('chooseWorkQueueSequence', {
        box: 'inbox',
        queue: 'section',
      })
      .then(() => {
        expect(test.getState('workQueueToDisplay')).toEqual({
          box: 'inbox',
          queue: 'section',
        });
      });

    await test
      .runSequence('chooseWorkQueueSequence', {
        //switched from inbox to outbox
        queue: 'section',
        box: 'inbox',
      })
      .then(() => {
        expect(test.getState('workQueueToDisplay')).toEqual({
          box: 'inbox',
          queue: 'section',
        });
      });

    expect(test.getState('workQueue.0.caseStatus')).toEqual('Recalled');
    const recalledWorkItem = test
      .getState('workQueue')
      .find(
        workItem =>
          workItem.docketNumber === test.docketNumber &&
          workItem.document.documentType === 'Petition',
      );

    const foundMessage = recalledWorkItem.messages.find(message => {
      return message.message === 'Petition recalled from IRS Holding Queue';
    });
    expect(foundMessage.message).toEqual(
      'Petition recalled from IRS Holding Queue',
    );
    // goto the first work item in the my queue inbox, the one we just recalled
    const documentId = test.getState('workQueue.0.document.documentId');
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: docketNumber,
      documentId: documentId,
    });

    expect(test.getState('caseDetail.docketNumber')).toEqual(docketNumber);

    expect(test.getState('workQueue.0.caseStatus')).toEqual('Recalled');
    expect(test.getState('caseDetail.status')).toEqual('Recalled');

    const caseDetailHelperRecalled = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    const documentDetailHelperRecalled = runCompute(documentDetailHelper, {
      state: test.getState(),
    });

    expect(documentDetailHelperRecalled.showCaseDetailsView).toEqual(false);
    expect(documentDetailHelperRecalled.showCaseDetailsEdit).toEqual(true);
    expect(caseDetailHelperRecalled.showServeToIrsButton).toEqual(true);
    expect(caseDetailHelperRecalled.showRecallButton).toEqual(false);

    // // assign to another petitionsclerk
    const workItem = test.getState('workQueue').find(item => {
      return item.isInitializeCase && item.docketNumber === docketNumber;
    });

    expect(workItem.showComplete).toBeFalsy();
    expect(workItem.showSendTo).toBeFalsy();

    await test.runSequence('selectWorkItemSequence', {
      workItem: workItem,
    });
    await test.runSequence('selectAssigneeSequence', {
      assigneeId: 'petitionsclerk',
      assigneeName: 'Test Petitionsclerk',
    });
    await test.runSequence('assignSelectedWorkItemsSequence');
    await test.runSequence('chooseWorkQueueSequence', {
      //switched from section inbox to mybox
      queue: 'my',
      box: 'outbox',
    });
    await generatePromise(1000, true); //why does the last promise in this test not work?

    await test.runSequence('chooseWorkQueueSequence', {
      //switched from section inbox to mybox
      queue: 'my',
      box: 'inbox',
    });
    await generatePromise(1000, true); //why does the last promise in this test not work?

    const assignedWorkItem = test.getState('workQueue').find(item => {
      return item.isInitializeCreate && item.docketNumber === docketNumber;
    });
    // no longer in our inbox!
    expect(assignedWorkItem).toBeUndefined();

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: docketNumber,
      documentId: documentId,
    });

    await test.runSequence('submitPetitionToIRSHoldingQueueSequence');
    expect(test.getState('caseDetail.docketNumber')).toEqual(docketNumber);
    // await test.runSequence('gotoDashboardSequence');
    await generatePromise(1000, true); //why does the last promise in this test not work?

    expect(test.getState('caseDetail.status')).toEqual('Batched for IRS');
  });
};
