export const admissionsClerkAddsNewPractitioner = integrationTest => {
  return it('admissions clerk adds a new practitioner', async () => {
    integrationTest.currentTimestamp = Date.now();

    await integrationTest.runSequence('gotoCreatePractitionerUserSequence');

    await integrationTest.runSequence('submitAddPractitionerSequence');

    expect(Object.keys(integrationTest.getState('validationErrors'))).toEqual([
      'phone',
      'email',
      'admissionsDate',
      'birthYear',
      'employer',
      'firstName',
      'lastName',
      'originalBarState',
      'practitionerType',
      'contact',
    ]);

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '111-111-1111',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: 'caroleBaskinH8r@example.com',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'month',
      value: '1',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'day',
      value: '1',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'year',
      value: '2010',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'birthYear',
      value: '1922',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'employer',
      value: 'Private',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'originalBarState',
      value: 'OK',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'practitionerType',
      value: 'Non-Attorney',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'firstName',
      value: `joe ${integrationTest.currentTimestamp}`,
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'lastName',
      value: 'exotic tiger king',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: '123 Zoo St',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.city',
      value: 'Middle of Nowhere',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.state',
      value: 'OK',
    });
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.postalCode',
      value: '09876',
    });

    await integrationTest.runSequence('submitAddPractitionerSequence');

    expect(Object.keys(integrationTest.getState('validationErrors'))).toEqual([
      'confirmEmail',
    ]);

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'caroleBaskinH8r@example.com',
    });

    await integrationTest.runSequence('submitAddPractitionerSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    integrationTest.barNumber = integrationTest.getState(
      'practitionerDetail.barNumber',
    );
  });
};
