export const docketClerkConsolidatesCases = integrationTest => {
  return it('Docket clerk consolidates cases', async () => {
    integrationTest.setState('modal.confirmSelection', true);
    await integrationTest.runSequence('submitAddConsolidatedCaseSequence');

    expect(integrationTest.getState('caseDetail')).toHaveProperty(
      'consolidatedCases',
    );
    expect(
      integrationTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(2);
    expect(integrationTest.getState('modal.showModal')).toBeUndefined();
  });
};
