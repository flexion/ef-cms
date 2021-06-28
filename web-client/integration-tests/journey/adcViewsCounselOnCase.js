export const adcViewsCounselOnCase = integrationTest => {
  return it('ADC views counsel on case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence(
      'showViewPetitionerCounselModalSequence',
      {
        privatePractitioner: integrationTest.privatePractitioner,
      },
    );

    expect(integrationTest.getState('modal.showModal')).toBe(
      'ViewPetitionerCounselModal',
    );
    expect(integrationTest.getState('modal.contact')).toEqual(
      integrationTest.privatePractitioner,
    );
  });
};
