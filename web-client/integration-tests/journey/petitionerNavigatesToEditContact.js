import { contactPrimaryFromState } from '../helpers';

export const petitionerNavigatesToEditContact = integrationTest => {
  it('petitioner views contact edit page', async () => {
    const contactPrimary = contactPrimaryFromState(integrationTest);
    const contactIdToUse = contactPrimary.contactId;

    await integrationTest.runSequence('gotoContactEditSequence', {
      contactId: contactIdToUse,
      docketNumber: integrationTest.getState('caseDetail.docketNumber'),
    });

    const currentPage = integrationTest.getState('currentPage');
    expect(currentPage).toEqual('ContactEdit');
  });
};
