export const petitionsClerkVerifyEligibleCase = integrationTest => {
  return it('Petitions clerk verifies the created case exists on the "Lubbock, Texas" trial session eligible list', async () => {
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: 'a1b04943-8ea8-422b-8990-dec3ca644c83',
    });

    expect(
      integrationTest
        .getState('trialSession.eligibleCases')
        .find(
          eligibleCase =>
            eligibleCase.docketNumber === integrationTest.docketNumber,
        ),
    ).toBeDefined();
  });
};
