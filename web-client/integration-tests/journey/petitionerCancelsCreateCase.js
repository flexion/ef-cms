export const petitionerCancelsCreateCase = integrationTest => {
  it('petitioner navigates to create case and cancels', async () => {
    await integrationTest.runSequence('gotoStartCaseWizardSequence', {
      step: '1',
      wizardStep: 'StartCaseStep1',
    });
    expect(integrationTest.getState('modal.showModal')).toBeFalsy();
    expect(integrationTest.getState('form')).toEqual({
      contactPrimary: {},
      wizardStep: '1',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Seattle, Washington',
    });
    expect(integrationTest.getState('form.preferredTrialCity')).toEqual(
      'Seattle, Washington',
    );

    await integrationTest.runSequence('formCancelToggleCancelSequence'); // someone clicks cancel
    expect(integrationTest.getState('modal.showModal')).toBeTruthy();
    await integrationTest.runSequence('formCancelToggleCancelSequence'); // someone aborts cancellation
    expect(integrationTest.getState('currentPage')).toEqual('StartCaseWizard');

    await integrationTest.runSequence('formCancelToggleCancelSequence');
    await integrationTest.runSequence('closeModalAndReturnToDashboardSequence');
    expect(integrationTest.getState('modal.showModal')).toBeFalsy();
    expect(integrationTest.getState('currentPage')).toEqual(
      'DashboardPetitioner',
    );
  });
};
