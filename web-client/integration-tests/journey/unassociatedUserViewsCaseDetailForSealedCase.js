export const unassociatedUserViewsCaseDetailForSealedCase = integrationTest => {
  return it('unassociated user views case detail for a sealed case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('caseDetail.isSealed')).toBeTruthy();
    expect(integrationTest.getState('caseDetail.docketNumber')).toBeDefined();

    //this user should NOT see any case details because they are not associated with the case
    expect(integrationTest.getState('caseDetail.sealedDate')).toBeUndefined();
    expect(integrationTest.getState('caseDetail.caseCaption')).toBeUndefined();
    expect(integrationTest.getState('caseDetail.docketEntries')).toEqual([]);
  });
};
