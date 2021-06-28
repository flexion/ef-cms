export const associatedUserViewsCaseDetailForSealedCase = integrationTest => {
  return it('associated user views case detail for a sealed case', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('caseDetail.sealedDate')).toBeDefined();
    expect(integrationTest.getState('caseDetail.isSealed')).toBeTruthy();
    //this user should see all case details because they are associated with the case
    expect(integrationTest.getState('caseDetail.caseCaption')).toBeDefined();
  });
};
