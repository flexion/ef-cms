import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const petitionerEditsCasePrimaryContactPhone = integrationTest => {
  return it('petitioner updates primary contact phone', async () => {
    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'contact.phone',
      value: '9999999999',
    });

    await integrationTest.runSequence('submitEditContactSequence');

    const contactPrimary = contactPrimaryFromState(integrationTest);

    expect(contactPrimary.phone).toEqual('999-999-9999');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const noticeDocument = formattedDocketEntriesOnDocketRecord.find(
      entry =>
        entry.descriptionDisplay ===
        'Notice of Change of Telephone Number for Mona Schultz',
    );
    expect(noticeDocument).toBeTruthy();
  });
};
