export const docketClerkOpensCaseUnconsolidateModal = integrationTest => {
  it('Docket clerk opens the unconsolidate modal', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('openCleanModalSequence', {
      showModal: 'UnconsolidateCasesModal',
    });
    expect(integrationTest.getState('modal.showModal')).toEqual(
      'UnconsolidateCasesModal',
    );
  });
};
