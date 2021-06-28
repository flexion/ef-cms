export const respondentUpdatesAddress = integrationTest => {
  return it('respondent updates address', async () => {
    await integrationTest.runSequence('gotoUserContactEditSequence');

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '',
    });

    await integrationTest.runSequence(
      'submitUpdateUserContactInformationSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({
      contact: { address1: expect.anything() },
    });

    integrationTest.updatedRespondentAddress = `UPDATED ADDRESS ${Date.now()}`;

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: integrationTest.updatedRespondentAddress,
    });

    await integrationTest.runSequence(
      'submitUpdateUserContactInformationSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});
  });
};
