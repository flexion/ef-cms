export const docketClerkViewsEligibleCasesForTrialSession = integrationTest => {
  return it('Docket clerk views eligible cases for a trial session', async () => {
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    expect(
      integrationTest.getState('trialSession.eligibleCases').length,
    ).toEqual(1);
    expect(
      integrationTest.getState('trialSession.eligibleCases.0.docketNumber'),
    ).toEqual(integrationTest.docketNumber);
  });
};
