import { InitialWorkItemMessage } from '../../../shared/src/business/entities/InitialWorkItemMessage';

const { VALIDATION_ERROR_MESSAGES } = InitialWorkItemMessage;

export default test => {
  return it('Docket clerk starts a new message thread on the Answer document', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.answerDocumentId,
    });

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('createWorkItemSequence');

    expect(test.getState('validationErrors')).toEqual({
      assigneeId: VALIDATION_ERROR_MESSAGES.assigneeId,
      message: VALIDATION_ERROR_MESSAGES.message,
      section: VALIDATION_ERROR_MESSAGES.section,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'section',
      value: 'docket',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'assigneeId',
      value: '2805d1ab-18d0-43ec-bafb-654e83405416', // docketclerk1
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'message',
      value: 'this is a new thread test message',
    });
    await test.runSequence('createWorkItemSequence');

    expect(test.getState('form')).toEqual({});

    await test.runSequence('gotoDashboardSequence');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
      workQueueIsInternal: true,
    });
    let sectionOutboxWorkQueue = test.getState('workQueue');
    let answerWorkItem = sectionOutboxWorkQueue.find(
      workItem => workItem.workItemId === test.answerWorkItemId,
    );
    expect(answerWorkItem.messages[0]).toMatchObject({
      message: 'this is a new thread test message',
    });
  });
};
