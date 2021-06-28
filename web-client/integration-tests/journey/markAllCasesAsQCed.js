export const markAllCasesAsQCed = (integrationTest, getDocketNumbers) => {
  return it('Marks all the eligible cases as QCed', async () => {
    const docketNumbers = getDocketNumbers();

    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    for (const docketNumber of docketNumbers) {
      await integrationTest.runSequence('updateQcCompleteForTrialSequence', {
        docketNumber,
        qcCompleteForTrial: true,
      });
    }
  });
};
