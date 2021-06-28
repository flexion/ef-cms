import { refreshElasticsearchIndex } from '../helpers';
export const respondentViewsCaseDetailNoticeOfChangeOfAddress = (
  integrationTest,
  createdDocketNumberIndex,
) => {
  return it('respondent views case detail notice of change of address', async () => {
    await refreshElasticsearchIndex();
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber:
        integrationTest.createdDocketNumbers[createdDocketNumberIndex],
    });

    const currentUser = integrationTest.getState('user');
    const irsPractitioners = integrationTest.getState(
      'caseDetail.irsPractitioners',
    );
    const irsPractitioner = irsPractitioners.find(
      practitioner => practitioner.userId === currentUser.userId,
    );

    expect(irsPractitioner.contact).toMatchObject({
      address1: integrationTest.updatedRespondentAddress,
    });

    const documents = integrationTest.getState('caseDetail.docketEntries');

    const changeOfAddressDocument = documents.find(
      document => document.documentType === 'Notice of Change of Address',
    );

    expect(changeOfAddressDocument.servedAt).toBeDefined();

    expect(changeOfAddressDocument).toBeDefined();

    expect(changeOfAddressDocument.documentTitle).toBe(
      'Notice of Change of Address',
    );
    expect(changeOfAddressDocument.additionalInfo).toBe(
      'for Test IRS Practitioner',
    );
    expect(changeOfAddressDocument.filedBy).toBeUndefined();
  });
};
