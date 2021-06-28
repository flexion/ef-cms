export const petitionsClerkManuallyRemovesCaseFromTrial = integrationTest => {
  return it('Petitions clerk manually removes a case from an uncalendared trial session', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.manuallyAddedTrialCaseDocketNumber,
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
