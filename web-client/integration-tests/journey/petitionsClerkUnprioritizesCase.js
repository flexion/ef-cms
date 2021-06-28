export const petitionsClerkUnprioritizesCase = integrationTest => {
  return it('Petitions clerk unprioritizes the case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('caseDetail').highPriority).toBeTruthy();

    await integrationTest.runSequence('unprioritizeCaseSequence');

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'High priority removed. Case is eligible for next available trial session.',
    );
    expect(integrationTest.getState('caseDetail').highPriority).toBeFalsy();
    expect(
      integrationTest.getState('caseDetail').highPriorityReason,
    ).toBeUndefined();
  });
};
