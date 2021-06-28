export const judgeViewsNotesFromCaseDetail = integrationTest => {
  return it('Judge views added notes from case detail', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('judgesNote.notes')).toEqual(
      'this is a note added from the modal',
    );
  });
};
