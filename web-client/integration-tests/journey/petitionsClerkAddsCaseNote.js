export const petitionsClerkAddsCaseNote = integrationTest => {
  return it('petitions clerk adds procedural note to a case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('caseDetail.caseNote')).toBeUndefined();

    await integrationTest.runSequence('openAddEditCaseNoteModalSequence');

    expect(integrationTest.getState('modal')).toMatchObject({
      notes: undefined,
    });

    await integrationTest.runSequence('cerebralBindSimpleSetStateSequence', {
      key: 'modal.notes',
      value: 'this is a note added from the modal',
    });

    expect(integrationTest.getState('modal')).toMatchObject({
      notes: 'this is a note added from the modal',
    });

    await integrationTest.runSequence('updateCaseNoteSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('caseDetail.caseNote')).toEqual(
      'this is a note added from the modal',
    );
  });
};
