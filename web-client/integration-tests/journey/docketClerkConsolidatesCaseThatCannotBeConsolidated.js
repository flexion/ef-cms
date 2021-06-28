export const docketClerkConsolidatesCaseThatCannotBeConsolidated =
  integrationTest => {
    return it('Docket clerk consolidates case that cannot be consolidated', async () => {
      integrationTest.setState('modal.confirmSelection', true);
      await integrationTest.runSequence('submitAddConsolidatedCaseSequence');

      expect(integrationTest.getState('modal.showModal')).toBe(
        'AddConsolidatedCaseModal',
      );
      expect(integrationTest.getState('modal.error')).toEqual([
        'Place of trial is not the same',
      ]);
      expect(
        integrationTest.getState('caseDetail.consolidatedCases'),
      ).toBeUndefined();
    });
  };
