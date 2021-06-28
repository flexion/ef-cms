export const petitionsClerkViewsACalendaredTrialSession = (
  integrationTest,
  expectedCount,
) => {
  return it('Petitions Clerk Views A Calendared Trial Session', async () => {
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    expect(integrationTest.getState('trialSession.isCalendared')).toEqual(true);
    expect(integrationTest.getState('trialSession.caseOrder').length).toEqual(
      expectedCount,
    );
  });
};
