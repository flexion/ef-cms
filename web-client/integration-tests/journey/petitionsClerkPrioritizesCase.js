export const petitionsClerkPrioritizesCase = integrationTest => {
  return it('Petitions clerk prioritizes the case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('caseDetail').highPriority).toBeFalsy();

    await integrationTest.runSequence('prioritizeCaseSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      reason: 'Provide a reason',
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'reason',
      value: 'just because',
    });

    await integrationTest.runSequence('prioritizeCaseSequence');

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Case added to eligible list and will be set for trial when calendar is set.',
    );
    expect(integrationTest.getState('caseDetail').highPriority).toBeTruthy();
    expect(integrationTest.getState('caseDetail').highPriorityReason).toEqual(
      'just because',
    );
  });
};
