import { contactPrimaryFromState, contactSecondaryFromState } from '../helpers';

export const practitionerViewsCaseDetailOfOwnedCase = integrationTest => {
  return it('Practitioner views case detail of owned case', async () => {
    integrationTest.setState('caseDetail', {});
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });
    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
    expect(
      integrationTest.getState('caseDetail.privatePractitioners.0.name'),
    ).toEqual('Test Private Practitioner');
    const contactPrimary = contactPrimaryFromState(integrationTest);
    const contactSecondary = contactSecondaryFromState(integrationTest);
    expect(
      integrationTest.getState(
        'caseDetail.privatePractitioners.0.representing',
      ),
    ).toEqual([contactPrimary.contactId, contactSecondary.contactId]);
  });
};
