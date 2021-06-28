export const docketClerkVerifiesEditCourtIssuedNonstandardFieldsWithJudge =
  integrationTest => {
    return it('docket clerk verifies that nonstandard judge field is populated on court-issued docket entry edit form', async () => {
      expect(integrationTest.getState('currentPage')).toEqual(
        'EditDocketEntryMeta',
      );

      expect(integrationTest.getState('form.freeText')).toEqual(
        'for Something',
      );
      expect(integrationTest.getState('form.judge')).toEqual('Buch');
    });
  };
