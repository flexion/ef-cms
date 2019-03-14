export default test => {
  return it('Docket clerk starts a new message thread on the Answer document', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.answerDocumentId,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'message',
      value: 'this is a new thread test message',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'assigneeId',
      value: '2805d1ab-18d0-43ec-bafb-654e83405416', // docketclerk1
    });

    await test.runSequence('createWorkItemSequence');

    const documents = test.getState('caseDetail.documents');
    const answer = documents.find(
      document => document.documentId === test.answerDocumentId,
    );
    const workItem = answer.workItems.find(
      workItem => workItem.sentBy === 'Test Docketclerk',
    );

    test.answerWorkItemId = workItem.workItemId;
    expect(workItem).toMatchObject({
      assigneeName: 'Test Docketclerk1',
      isInitializeCase: false,
      messages: [
        {
          from: 'Test Docketclerk',
          fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'this is a new thread test message',
          to: 'Test Docketclerk1',
          toUserId: '2805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      section: 'docket',
      sentBy: 'Test Docketclerk',
    });
  });
};
