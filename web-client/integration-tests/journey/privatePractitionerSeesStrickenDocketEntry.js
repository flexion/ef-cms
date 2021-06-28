import {
  contactPrimaryFromState,
  getFormattedDocketEntriesForTest,
} from '../helpers';

export const privatePractitionerSeesStrickenDocketEntry = (
  integrationTest,
  docketRecordIndex,
) => {
  return it('private practitioner sees stricken docket entry on case detail', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const contactPrimary = contactPrimaryFromState(integrationTest);
    expect(contactPrimary.name).toBeDefined();

    const formattedDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.index === docketRecordIndex,
    );
    integrationTest.docketEntryId = formattedDocketEntry.docketEntryId;

    expect(formattedDocketEntry.isStricken).toEqual(true);
    expect(formattedDocketEntry.showDocumentDescriptionWithoutLink).toEqual(
      true,
    );
  });
};
