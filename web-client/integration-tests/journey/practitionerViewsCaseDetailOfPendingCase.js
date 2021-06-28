export const practitionerViewsCaseDetailOfPendingCase = integrationTest => {
  return it('Practitioner views case detail of owned case', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
    expect(
      integrationTest.getState('screenMetadata.pendingAssociation'),
    ).toEqual(true);
  });
};
