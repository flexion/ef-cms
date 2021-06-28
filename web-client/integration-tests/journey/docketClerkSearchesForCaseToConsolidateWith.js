export const docketClerkSearchesForCaseToConsolidateWith = integrationTest => {
  return it('Docket clerk searches for case to consolidate with', async () => {
    integrationTest.setState(
      'modal.searchTerm',
      integrationTest.leadDocketNumber,
    );
    await integrationTest.runSequence(
      'submitCaseSearchForConsolidationSequence',
      {
        docketNumber: integrationTest.leadDocketNumber,
      },
    );
    expect(integrationTest.getState('modal.caseDetail.docketNumber')).toEqual(
      integrationTest.leadDocketNumber,
    );
  });
};
