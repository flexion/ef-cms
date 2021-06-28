export const petitionsClerkSelectsFirstPetitionOnMyDocumentQC =
  integrationTest => {
    return it('Petitions clerk selects first petition on My Document QC', async () => {
      const workItem = integrationTest
        .getState('workQueue')
        .find(
          workItemInQueue =>
            workItemInQueue.docketNumber === integrationTest.docketNumber,
        );

      const { docketEntryId } = workItem.docketEntry;

      integrationTest.docketEntryId = docketEntryId;
    });
  };
