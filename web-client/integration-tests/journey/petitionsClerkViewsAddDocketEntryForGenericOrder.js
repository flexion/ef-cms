export const petitionsClerkViewsAddDocketEntryForGenericOrder =
  integrationTest => {
    return it('Petitions clerk views Add Docket Entry form for generic order', async () => {
      await integrationTest.runSequence(
        'gotoAddCourtIssuedDocketEntrySequence',
        {
          docketEntryId: integrationTest.docketEntryId,
          docketNumber: integrationTest.docketNumber,
        },
      );

      expect(integrationTest.getState('currentPage')).toEqual(
        'CourtIssuedDocketEntry',
      );
      expect(integrationTest.getState('form.freeText')).toEqual(
        integrationTest.freeText,
      );
    });
  };
