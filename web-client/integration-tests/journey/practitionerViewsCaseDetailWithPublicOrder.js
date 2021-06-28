import { getFormattedDocketEntriesForTest } from '../helpers';

export const practitionerViewsCaseDetailWithPublicOrder = integrationTest => {
  return it('Practitioner views case detail with a publically-available order', async () => {
    integrationTest.setState('caseDetail', {});

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    expect(integrationTest.getState('currentPage')).toEqual('CaseDetail');

    const publicallyAvailableOrderDocketEntry =
      formattedDocketEntriesOnDocketRecord.find(d => d.eventCode === 'O');

    expect(publicallyAvailableOrderDocketEntry.showLinkToDocument).toBeTruthy();
  });
};
