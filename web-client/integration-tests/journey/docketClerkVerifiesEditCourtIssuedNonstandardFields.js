export const docketClerkVerifiesEditCourtIssuedNonstandardFields =
  integrationTest => {
    return it('docket clerk verifies that nonstandard fields are displayed on court-issued docket entry edit form', async () => {
      expect(integrationTest.getState('currentPage')).toEqual(
        'EditDocketEntryMeta',
      );

      expect(integrationTest.getState('form.freeText')).toEqual('be free');
      expect(integrationTest.getState('form.month')).toEqual('4');
      expect(integrationTest.getState('form.day')).toEqual('4');
      expect(integrationTest.getState('form.year')).toEqual('2050');
    });
  };
