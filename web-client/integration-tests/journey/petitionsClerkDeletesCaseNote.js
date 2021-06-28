export const petitionsClerkDeletesCaseNote = integrationTest => {
  return it('petitions clerk deletes case note from a case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('caseDetail.caseNote')).toEqual(
      'this is a note added from the modal',
    );

    await integrationTest.runSequence('openDeleteCaseNoteConfirmModalSequence');

    await integrationTest.runSequence('deleteCaseNoteSequence');

    expect(integrationTest.getState('caseDetail.caseNote')).toBeUndefined();
  });
};
