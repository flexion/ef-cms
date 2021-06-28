export const petitionsClerkEditOtherStatisticToCase = integrationTest => {
  return it('petitions clerk edits other statistic on the case', async () => {
    await integrationTest.runSequence('gotoEditOtherStatisticsSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('caseDetail.damages')).toEqual(5678);
    expect(integrationTest.getState('caseDetail.litigationCosts')).toEqual(
      1234,
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'litigationCosts',
      value: 99,
    });

    await integrationTest.runSequence('submitEditOtherStatisticsSequence');

    expect(integrationTest.getState('caseDetail.litigationCosts')).toEqual(99);
  });
};
