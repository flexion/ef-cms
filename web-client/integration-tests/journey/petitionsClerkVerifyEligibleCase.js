export const petitionsClerkVerifyEligibleCase = test => {
  return it('Petitions clerk verifies the created case exists on the "Lubbock, Texas" trial session eligible list', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: 'a1b04943-8ea8-422b-8990-dec3ca644c83',
    });

    expect(
      test
        .getState('trialSession.eligibleCases')
        .find(eligibleCase => eligibleCase.docketNumber === test.docketNumber),
    ).toBeDefined();
  });
};
