export const petitionsClerkViewsCreateNewCase = integrationTest => {
  return it('Petitions clerk views Start Case from Paper (internal Case Journey)', async () => {
    await integrationTest.runSequence('gotoStartCaseWizardSequence', {
      step: 1,
      wizardStep: 'StartCaseStep1',
    });

    expect(integrationTest.getState('currentPage')).toEqual(
      'StartCaseInternal',
    );
  });
};
