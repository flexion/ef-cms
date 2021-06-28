export const userUpdatesEmailAddressToOneAlreadyInUse = (
  integrationTest,
  user,
) =>
  it(`${user} updates email address to one that is already in use`, async () => {
    await integrationTest.runSequence('gotoChangeLoginAndServiceEmailSequence');

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: 'petitioner1@example.com',
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: 'petitioner1@example.com',
    });

    await integrationTest.runSequence(
      'submitChangeLoginAndServiceEmailSequence',
    );

    expect(integrationTest.getState('validationErrors.email')).toBeDefined();
  });
