export const petitionsClerkRemovesRespondentFromCase = integrationTest => {
  return it('Petitions clerk removes a respondent from a case', async () => {
    expect(
      integrationTest.getState('caseDetail.irsPractitioners').length,
    ).toEqual(2);

    const barNumber = integrationTest.getState(
      'caseDetail.irsPractitioners.1.barNumber',
    );

    await integrationTest.runSequence('gotoEditRespondentCounselSequence', {
      barNumber,
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence(
      'openRemoveRespondentCounselModalSequence',
    );

    expect(integrationTest.getState('modal.showModal')).toBe(
      'RemoveRespondentCounselModal',
    );

    await integrationTest.runSequence(
      'removeRespondentCounselFromCaseSequence',
    );

    expect(
      integrationTest.getState('caseDetail.irsPractitioners').length,
    ).toEqual(1);
  });
};
