export const docketClerkRemovesCaseFromTrial = integrationTest => {
  return it('Docket clerk removes case from trial session', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence(
      'openRemoveFromTrialSessionModalSequence',
    );
    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'disposition',
      value: 'Test disposition',
    });

    await integrationTest.runSequence('removeCaseFromTrialSequence');
  });
};
