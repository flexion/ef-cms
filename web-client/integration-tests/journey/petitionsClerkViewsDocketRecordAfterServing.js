export const petitionsClerkViewsDocketRecordAfterServing = integrationTest => {
  return it('Petitions clerk views docket record after serving petition on the IRS', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    expect(integrationTest.getState('caseDetail.docketEntries')).toContainEqual(
      {
        description: 'Filing Fee Paid',
        eventCode: 'FEE',
        filingDate: '2018-12-24T05:00:00.000Z',
        index: 6,
      },
    );
  });
};
