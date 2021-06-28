export const petitionsClerkDeletesOtherStatisticToCase = integrationTest => {
  return it('petitions clerk deletes other statistic on the case', async () => {
    await integrationTest.runSequence('gotoEditOtherStatisticsSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('caseDetail.damages')).toBeDefined();
    expect(
      integrationTest.getState('caseDetail.litigationCosts'),
    ).toBeDefined();

    await integrationTest.runSequence('deleteOtherStatisticsSequence');

    expect(integrationTest.getState('caseDetail.litigationCosts')).toEqual(
      null,
    );
    expect(integrationTest.getState('caseDetail.damages')).toEqual(null);
  });
};
