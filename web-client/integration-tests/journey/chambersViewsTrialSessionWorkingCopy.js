export const chambersViewsTrialSessionWorkingCopy = integrationTest => {
  return it('Chambers views trial session working copy', async () => {
    await integrationTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );
  });
};
