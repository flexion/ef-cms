export const petitionsClerkAddsOtherStatisticsToCase = integrationTest => {
  return it('petitions clerk adds other statistics to case', async () => {
    await integrationTest.runSequence('gotoAddOtherStatisticsSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'AddOtherStatistics',
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'litigationCosts',
      value: 1234,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'damages',
      value: 5678,
    });

    await integrationTest.runSequence('submitAddOtherStatisticsSequence');

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    expect(integrationTest.getState('caseDetail')).toMatchObject({
      damages: 5678,
      litigationCosts: 1234,
    });
  });
};
