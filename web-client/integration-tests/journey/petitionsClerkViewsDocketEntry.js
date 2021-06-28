import { getFormattedDocketEntriesForTest } from '../helpers';

export const petitionsClerkViewsDocketEntry = (
  integrationTest,
  draftOrderIndex,
) => {
  return it('Petitions Clerk views the docket entry for the given document', async () => {
    const { docketEntryId } = integrationTest.draftOrders[draftOrderIndex];
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const docketRecordEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === docketEntryId,
    );

    expect(docketRecordEntry).toBeTruthy();
  });
};
