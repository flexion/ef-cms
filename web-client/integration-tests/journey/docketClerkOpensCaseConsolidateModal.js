export const docketClerkOpensCaseConsolidateModal = integrationTest => {
  it('Docket clerk opens the consolidation modal', async () => {
    await integrationTest.runSequence('openCleanModalSequence', {
      showModal: 'AddConsolidatedCaseModal',
    });
    expect(integrationTest.getState('modal.showModal')).toEqual(
      'AddConsolidatedCaseModal',
    );
  });
};
