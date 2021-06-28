export const petitionsClerkDeleteDeficiencyStatistic = integrationTest => {
  return it('petitions clerk deletes the deficiency statistic', async () => {
    const statistics = integrationTest.getState('caseDetail.statistics');

    const { statisticId } = statistics[0];

    await integrationTest.runSequence('gotoEditDeficiencyStatisticSequence', {
      docketNumber: integrationTest.docketNumber,
      statisticId,
    });

    await integrationTest.runSequence('deleteDeficiencyStatisticsSequence');

    expect(
      integrationTest
        .getState('caseDetail.statistics')
        .find(s => s.statisticId === statisticId),
    ).toBeUndefined();
  });
};
