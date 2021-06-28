import { getFormattedDocketEntriesForTest } from '../helpers';

export const irsSuperuserSearchForUnservedCase = integrationTest => {
  return it('irsSuperuser searches for an unserved case by docket number from dashboard', async () => {
    await integrationTest.runSequence('gotoDashboardSequence');
    integrationTest.setState('header.searchTerm', integrationTest.docketNumber);
    await integrationTest.runSequence('submitCaseSearchSequence');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const petitionDocketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.documentTitle === 'Petition',
    );
    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');
    // irsSuperuser should NOT see a link to a petition
    // document that has not been served
    expect(petitionDocketEntry.showLinkToDocument).toBeFalsy();
  });
};
