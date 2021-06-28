import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';
import { refreshElasticsearchIndex } from '../helpers';

export const unassociatedUserAdvancedSearchForSealedCase = integrationTest => {
  return it('unassociated user performs an advanced search by name for a sealed case', async () => {
    await refreshElasticsearchIndex();

    await integrationTest.runSequence('gotoAdvancedSearchSequence');

    await integrationTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByName',
      key: 'petitionerName',
      value: 'NOTAREALNAMEFORTESTING',
    });

    await integrationTest.runSequence('submitCaseAdvancedSearchSequence');

    expect(
      integrationTest
        .getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`)
        .find(result => result.docketNumber === integrationTest.docketNumber),
    ).toBeUndefined();
  });
};
