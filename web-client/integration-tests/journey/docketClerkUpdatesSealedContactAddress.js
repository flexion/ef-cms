import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';

export const docketClerkUpdatesSealedContactAddress = (
  integrationTest,
  contactType,
) => {
  return it('docket clerk updates sealed contact address', async () => {
    let contact;
    if (contactType === 'contactPrimary') {
      contact = contactPrimaryFromState(integrationTest);
    } else if (contactType === 'contactSecondary') {
      contact = contactSecondaryFromState(integrationTest);
    }

    await integrationTest.runSequence(
      'gotoEditPetitionerInformationInternalSequence',
      {
        contactId: contact.contactId,
        docketNumber: integrationTest.docketNumber,
      },
    );

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.address1',
      value: 'somewhere over the rainbow',
    });

    await integrationTest.runSequence('submitEditPetitionerSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(
      integrationTest.getState(
        'currentViewMetadata.caseDetail.caseInformationTab',
      ),
    ).toEqual('parties');

    const docketEntries = integrationTest.getState('caseDetail.docketEntries');
    const noticeOfContactChange = docketEntries.find(
      d => d.eventCode === 'NCA',
    );

    expect(noticeOfContactChange).toBeUndefined();
  });
};
