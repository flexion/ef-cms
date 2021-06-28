export const trialClerkViewsNotesFromCaseDetail = integrationTest => {
  return it('Trial Clerk views added notes from case detail', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('judgesNote.notes')).toEqual(undefined);
    expect(integrationTest.getState('caseDetail.judgesNote.notes')).toEqual(
      undefined,
    );
  });
};
