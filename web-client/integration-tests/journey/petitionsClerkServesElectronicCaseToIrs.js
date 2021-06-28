export const petitionsClerkServesElectronicCaseToIrs = integrationTest => {
  return it(`Petitions clerk serves an electronically-filed case (${integrationTest.docketNumber}) to IRS`, async () => {
    await integrationTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('saveSavedCaseForLaterSequence');

    await integrationTest.runSequence('openConfirmServeToIrsModalSequence');

    await integrationTest.runSequence('serveCaseToIrsSequence');

    expect(integrationTest.getState('currentPage')).toEqual('WorkQueue');
  });
};
