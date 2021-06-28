import { ADVANCED_SEARCH_TABS } from '../../../shared/src/business/entities/EntityConstants';

export const unauthedUserSearchesByDocketNumber = (integrationTest, params) => {
  return it('Search for cases by docket number', async () => {
    let searchResults;
    const queryParams = {
      docketNumber: params.docketNumber,
    };
    integrationTest.docketNumber = params.docketNumber;

    await integrationTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: '123-xx',
    });
    await integrationTest.runSequence(
      'submitPublicCaseDocketNumberSearchSequence',
      {},
    );
    searchResults = integrationTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );
    expect(searchResults).toEqual([]);
    expect(integrationTest.currentRouteUrl.indexOf('/case-detail')).toEqual(-1);

    await integrationTest.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'caseSearchByDocketNumber',
    });
    expect(
      integrationTest.getState(`searchResults.${ADVANCED_SEARCH_TABS.CASE}`),
    ).toBeUndefined();
    expect(
      integrationTest.getState('advancedSearchForm.caseSearchByDocketNumber'),
    ).toEqual({});

    await integrationTest.runSequence('updateAdvancedSearchFormValueSequence', {
      formType: 'caseSearchByDocketNumber',
      key: 'docketNumber',
      value: queryParams.docketNumber,
    });
    await integrationTest.runSequence(
      'submitPublicCaseDocketNumberSearchSequence',
      {},
    );
    searchResults = integrationTest.getState(
      `searchResults.${ADVANCED_SEARCH_TABS.CASE}`,
    );
    expect(
      integrationTest.currentRouteUrl.indexOf(
        `/case-detail/${params.docketNumber}`,
      ),
    ).toEqual(0);
  });
};
