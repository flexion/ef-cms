export const docketClerkVerifiesDocketEntryMetaUpdatesInEditForm =
  integrationTest => {
    return it('docket clerk verifies docket entry meta updates in edit form', async () => {
      expect(integrationTest.getState('currentPage')).toEqual(
        'EditDocketEntryMeta',
      );

      expect(integrationTest.getState('form.hasOtherFilingParty')).toBe(true);
      expect(integrationTest.getState('form.otherFilingParty')).toBe(
        'Brianna Noble',
      );
    });
  };
