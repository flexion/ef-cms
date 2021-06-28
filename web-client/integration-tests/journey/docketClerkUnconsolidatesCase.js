export const docketClerkUnconsolidatesCase = integrationTest => {
  it('Docket clerk unconsolidate a case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.leadDocketNumber,
    });

    await integrationTest.runSequence('openCleanModalSequence', {
      showModal: 'UnconsolidateCasesModal',
    });
    expect(integrationTest.getState('modal.showModal')).toEqual(
      'UnconsolidateCasesModal',
    );
    const currentDocketNumber = integrationTest.getState(
      'caseDetail.docketNumber',
    );

    await integrationTest.runSequence('updateModalValueSequence', {
      key: `casesToRemove.${currentDocketNumber}`,
      value: true,
    });

    await integrationTest.runSequence('submitRemoveConsolidatedCasesSequence');

    expect(
      integrationTest.getState('caseDetail.leadDocketNumber'),
    ).toBeUndefined();
    expect(
      integrationTest.getState('caseDetail.consolidatedCases').length,
    ).toEqual(0);
  });
};
