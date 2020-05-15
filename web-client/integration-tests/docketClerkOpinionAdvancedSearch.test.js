import { DocumentSearch } from '../../shared/src/business/entities/documents/DocumentSearch';

import { loginAs, refreshElasticsearchIndex, setupTest } from './helpers';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});

describe('docket clerk opinion advanced search', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'docketclerk');

  it('go to advanced opinion search tab', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoAdvancedSearchSequence');

    await test.runSequence('submitOpinionAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({
      keyword: DocumentSearch.VALIDATION_ERROR_MESSAGES.keyword,
    });
  });

  it('search for a keyword that is not present in any served opinion', async () => {
    test.setState('advancedSearchForm', {
      opinionSearch: {
        keyword: 'osteodontolignikeratic',
      },
    });

    await test.runSequence('submitOpinionAdvancedSearchSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('searchResults')).toEqual([]);
  });

  it('search for a keyword that is present in a served opinion', async () => {
    test.setState('advancedSearchForm', {
      opinionSearch: {
        keyword: 'sunglasses',
      },
    });

    await test.runSequence('submitOpinionAdvancedSearchSequence');

    expect(test.getState('searchResults')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: '130a3790-7e82-4f5c-8158-17f5d9d560e7',
          documentTitle:
            'T.C. Opinion Judge Armen Some very strong opinions about sunglasses',
        }),
      ]),
    );
  });

  it('clears search fields', async () => {
    test.setState('advancedSearchForm', {
      opinionSearch: {
        keyword: 'sunglasses',
      },
    });

    await test.runSequence('clearAdvancedSearchFormSequence', {
      formType: 'opinionSearch',
    });

    expect(test.getState('advancedSearchForm.opinionSearch')).toEqual({
      keyword: '',
    });
  });

  it('clears validation errors when switching tabs', async () => {
    test.setState('advancedSearchForm', {
      opinionSearch: {},
    });

    await test.runSequence('submitOpinionAdvancedSearchSequence');

    expect(test.getState('alertError')).toEqual({
      messages: ['Enter a keyword or phrase'],
      title: 'Please correct the following errors:',
    });

    await test.runSequence('advancedSearchTabChangeSequence');

    expect(test.getState('alertError')).not.toBeDefined();
  });
});
