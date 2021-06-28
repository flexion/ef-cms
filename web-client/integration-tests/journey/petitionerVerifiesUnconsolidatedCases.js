export const petitionerVerifiesUnconsolidatedCases = integrationTest => {
  return it('Petitioner verifies the cases were unconsolidated', async () => {
    const cases = integrationTest.getState('openCases');

    const casesWithConsolidation = cases.filter(
      caseDetail =>
        caseDetail.leadDocketNumber === integrationTest.leadDocketNumber,
    );
    expect(casesWithConsolidation.length).toEqual(0);
  });
};
