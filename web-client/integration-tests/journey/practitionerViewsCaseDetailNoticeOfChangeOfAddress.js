import { refreshElasticsearchIndex } from '../helpers';

export const practitionerViewsCaseDetailNoticeOfChangeOfAddress = (
  integrationTest,
  createdDocketNumberIndex,
) => {
  return it('practitioner views case detail notice of change of address', async () => {
    await refreshElasticsearchIndex(5000);

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber:
        integrationTest.createdDocketNumbers[createdDocketNumberIndex],
    });

    const currentUser = integrationTest.getState('user');
    const privatePractitioners = integrationTest.getState(
      'caseDetail.privatePractitioners',
    );
    const privatePractitioner = privatePractitioners.find(
      practitioner => practitioner.userId === currentUser.userId,
    );

    expect(privatePractitioner.contact).toMatchObject({
      address1: integrationTest.updatedPractitionerAddress,
    });

    expect(privatePractitioner.firmName).toBe('My Awesome Law Firm');

    const documents = integrationTest.getState('caseDetail.docketEntries');

    const changeOfAddressDocument = documents.find(
      document => document.documentType === 'Notice of Change of Address',
    );

    expect(changeOfAddressDocument.servedAt).toBeDefined();

    expect(changeOfAddressDocument.documentTitle).toBe(
      'Notice of Change of Address',
    );
    expect(changeOfAddressDocument.additionalInfo).toBe('for Lilah Gilbert');
    expect(changeOfAddressDocument.filedBy).toBeUndefined();

    expect(changeOfAddressDocument).toBeDefined();
  });
};
