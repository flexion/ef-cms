import { refreshElasticsearchIndex } from '../helpers';

export default test => {
  return it('unassociated user performs an advanced search by name for a sealed case', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoAdvancedSearchSequence');

    await test.runSequence('updateAdvancedSearchFormValueSequence', {
      key: 'petitionerName',
      value: 'NOTAREALNAMEFORTESTING',
    });

    await test.runSequence('submitCaseAdvancedSearchSequence');

    expect(
      test
        .getState('searchResults')
        .find(result => result.docketNumber === test.docketNumber),
    ).toBeUndefined();
  });
};
