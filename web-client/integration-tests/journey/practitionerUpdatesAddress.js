const faker = require('faker');
const { refreshElasticsearchIndex } = require('../helpers');

export const practitionerUpdatesAddress = integrationTest => {
  return it('practitioner updates address', async () => {
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

    integrationTest.updatedPractitionerAddress =
      faker.address.streetAddress(true);

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: integrationTest.updatedPractitionerAddress,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'firmName',
      value: 'My Awesome Law Firm',
    });

    await integrationTest.runSequence(
      'submitUpdateUserContactInformationSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('userContactUpdateCompleteSequence');

    await refreshElasticsearchIndex(5000);

    expect(integrationTest.getState('alertSuccess')).toMatchObject({
      message: 'Changes saved.',
    });
  });
};
