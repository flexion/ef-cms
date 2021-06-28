const {
  contactPrimaryFromState,
  contactSecondaryFromState,
} = require('../helpers');

export const docketClerkSealsContactInformation = (
  integrationTest,
  contactType,
  docketNumber,
) => {
  return it(`Docket clerk seals ${contactType} information`, async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || integrationTest.docketNumber,
    });

    let contactToSeal;

    if (contactType === 'contactPrimary') {
      contactToSeal = contactPrimaryFromState(integrationTest);
    } else if (contactType === 'contactSecondary') {
      contactToSeal = contactSecondaryFromState(integrationTest);
    } else {
      contactToSeal = integrationTest
        .getState(`caseDetail.${contactType}`)
        .find(contact => contact.isAddressSealed === false);
    }

    expect(contactToSeal.isAddressSealed).toBe(false);

    await integrationTest.runSequence('openSealAddressModalSequence', {
      contactToSeal,
    });

    expect(integrationTest.getState('contactToSeal')).toEqual(contactToSeal);
    expect(integrationTest.getState('modal.showModal')).toEqual(
      'SealAddressModal',
    );

    await integrationTest.runSequence('sealAddressSequence');

    expect(integrationTest.getState('modal.showModal')).toBeUndefined();
    expect(integrationTest.getState('alertSuccess.message')).toEqual(
      `Address sealed for ${contactToSeal.name}.`,
    );

    if (contactType === 'contactPrimary') {
      contactToSeal = contactPrimaryFromState(integrationTest);
    } else if (contactType === 'contactSecondary') {
      contactToSeal = contactSecondaryFromState(integrationTest);
    } else {
      contactToSeal = integrationTest
        .getState(`caseDetail.${contactType}`)
        .find(c => c.contactId === contactToSeal.contactId);
    }

    expect(contactToSeal.isAddressSealed).toBe(true);
  });
};
