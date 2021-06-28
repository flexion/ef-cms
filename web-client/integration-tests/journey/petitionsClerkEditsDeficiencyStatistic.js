export const petitionsClerkEditsDeficiencyStatistic = integrationTest => {
  return it('petitions clerk edits deficiency statistic on case', async () => {
    const statistics = integrationTest.getState('caseDetail.statistics');

    const { statisticId } = statistics[0];

    await integrationTest.runSequence('gotoEditDeficiencyStatisticSequence', {
      docketNumber: integrationTest.docketNumber,
      statisticId,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'irsDeficiencyAmount',
      value: 1000,
    });

    await integrationTest.runSequence('submitEditDeficiencyStatisticSequence');

    expect(
      integrationTest.getState('caseDetail.statistics')[0].irsDeficiencyAmount,
    ).toEqual(1000);
  });
};
