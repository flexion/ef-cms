import { runCompute } from 'cerebral/test';

import { caseDetailHelper } from '../../src/presenter/computeds/caseDetailHelper';
import { documentDetailHelper as documentDetailHelperComputed } from '../../src/presenter/computeds/documentDetailHelper';

import { withAppContextDecorator } from '../../src/withAppContext';

const documentDetailHelper = withAppContextDecorator(
  documentDetailHelperComputed,
);
/**
 * This is needed because some sequences run router.route which runs another test.runSequence which
 * adds an new entry on the node event loop and causes the tests to continue running even though the sequence is
 * not yet done.
 *
 * @returns {Promise} resolves when the sertImmediate is done
 */
const waitForRouter = () => {
  return new Promise(resolve => {
    setImmediate(() => resolve(true));
  });
};

export default test => {
  return it('Petitions clerk views IRS Holding Queue', async () => {
    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });

    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'my',
    });

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'section',
    });

    // verify item in general status older than 7 days does not show
    expect(
      test.getState('workQueue').find(item => {
        return item.isInitializeCreate && item.docketNumber === '199-18';
      }),
    ).toBeUndefined();

    let workItem = test
      .getState('workQueue')
      .find(
        item =>
          item.docketNumber === test.docketNumber &&
          item.caseStatus === 'Batched for IRS',
      );

    // verify that the section workitems are in state
    expect(test.getState('workQueue').length).toBeGreaterThan(0);
    // the first item in the outbox should be the Petition batched for IRS from the previous test
    expect(workItem).toBeDefined();
    // goto the first work item in the section queue outbox, the one we just batched for IRS
    const docketNumber = workItem.docketNumber;
    const documentId = workItem.document.documentId;
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber,
      documentId,
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

    await test.runSequence('submitRecallPetitionFromIRSHoldingQueueSequence');
    await waitForRouter();

    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'outbox',
      queue: 'section',
    });

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });

    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'section',
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
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber,
      documentId,
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

    // assign to another petitionsclerk
    workItem = test.getState('workQueue').find(item => {
      return item.isInitializeCase && item.docketNumber === docketNumber;
    });

    expect(workItem.showComplete).toBeFalsy();
    expect(workItem.showSendTo).toBeFalsy();

    await test.runSequence('selectWorkItemSequence', {
      workItem: workItem,
    });

    await test.runSequence('selectAssigneeSequence', {
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Petitionsclerk',
    });

    await test.runSequence('assignSelectedWorkItemsSequence');

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });

    // no longer in our inbox!
    expect(
      test.getState('workQueue').find(item => {
        return item.isInitializeCreate && item.docketNumber === docketNumber;
      }),
    ).toBeUndefined();

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: docketNumber,
      documentId: documentId,
    });

    expect(test.getState('currentPage')).toEqual('DocumentDetail');

    await test.runSequence('submitPetitionToIRSHoldingQueueSequence');
    await waitForRouter();

    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'section',
    });

    workItem = test
      .getState('workQueue')
      .find(
        item =>
          item.docketNumber === test.docketNumber &&
          item.caseStatus === 'Batched for IRS',
      );
    expect(workItem).toBeDefined();
  });
};
