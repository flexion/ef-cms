export const trialClerkViewsNotesFromCaseDetail = test => {
  return it('Trial Clerk views added notes from case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(test.getState('judgesNote.notes')).toEqual(undefined);
    expect(test.getState('caseDetail.judgesNote.notes')).toEqual(undefined);
  });
};
