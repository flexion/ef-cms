const {
  contactPrimaryFromState,
  contactSecondaryFromState,
} = require('../helpers');

export const petitionsClerkViewsCaseWithSealedContact = (
  integrationTest,
  contactType,
  docketNumber,
) => {
  return it(`Petitions clerk views case with sealed ${contactType}`, async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: docketNumber || integrationTest.docketNumber,
    });

    let sealedContact;
    if (contactType === 'contactPrimary') {
      sealedContact = contactPrimaryFromState(integrationTest);
    } else if (contactType === 'contactSecondary') {
      sealedContact = contactSecondaryFromState(integrationTest);
    } else {
      sealedContact = integrationTest
        .getState(`caseDetail.${contactType}`)
        .find(c => c.isAddressSealed === true);
    }

    expect(sealedContact.isAddressSealed).toBe(true);
    expect(sealedContact.address1).toBeUndefined();
    expect(sealedContact.phone).toBeUndefined();
  });
};
