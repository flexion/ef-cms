export const trialClerkViewsTrialSessionWorkingCopy = integrationTest => {
  return it('Trial Clerk views trial session working copy', async () => {
    await integrationTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: integrationTest.trialSessionId,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );
    expect(
      integrationTest.getState('trialSessionWorkingCopy.trialSessionId'),
    ).toEqual(integrationTest.trialSessionId);
    expect(
      integrationTest.getState('trialSessionWorkingCopy.filters.showAll'),
    ).toEqual(true);
    expect(integrationTest.getState('trialSessionWorkingCopy.sort')).toEqual(
      'docket',
    );
    expect(
      integrationTest.getState('trialSessionWorkingCopy.sortOrder'),
    ).toEqual('asc');
    expect(integrationTest.getState('trialSession.caseOrder').length).toEqual(
      1,
    );
  });
};
