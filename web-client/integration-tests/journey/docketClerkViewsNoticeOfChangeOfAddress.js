export const docketClerkViewsNoticeOfChangeOfAddress = integrationTest => {
  return it('Docket clerk views Notice of Change of Address on the docket record', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const noticeDocument = integrationTest
      .getState('caseDetail.docketEntries')
      .find(d => d.documentTitle === 'Notice of Change of Address');

    expect(noticeDocument.servedAt).toBeDefined();
  });
};
