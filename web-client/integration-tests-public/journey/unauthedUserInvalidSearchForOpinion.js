import { DocumentSearch } from '../../../shared/src/business/entities/documents/DocumentSearch';

export const unauthedUserInvalidSearchForOpinion = integrationTest => {
  return it('Search for opinion without a keyword', async () => {
    await integrationTest.runSequence('gotoPublicSearchSequence');

    await integrationTest.runSequence(
      'submitPublicOpinionAdvancedSearchSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({
      keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
    });
  });
};
