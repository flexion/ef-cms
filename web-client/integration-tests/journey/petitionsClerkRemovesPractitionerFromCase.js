export const petitionsClerkRemovesPractitionerFromCase = integrationTest => {
  return it('Petitions clerk removes a practitioner from a case', async () => {
    expect(
      integrationTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(2);

    const barNumber = integrationTest.getState(
      'caseDetail.privatePractitioners.0.barNumber',
    );

    await integrationTest.runSequence('gotoEditPetitionerCounselSequence', {
      barNumber,
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('currentPage')).toEqual(
      'EditPetitionerCounsel',
    );

    await integrationTest.runSequence(
      'openRemovePetitionerCounselModalSequence',
    );

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'RemovePetitionerCounselModal',
    );

    await integrationTest.runSequence(
      'removePetitionerCounselFromCaseSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(
      integrationTest.getState('caseDetail.privatePractitioners').length,
    ).toEqual(1);
  });
};
