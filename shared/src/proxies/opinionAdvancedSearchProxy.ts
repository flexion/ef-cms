import { RawInternalDocumentSearchResult } from '@shared/business/entities/documents/InternalDocumentSearchResult';
import { get } from './requests';
import { omit } from 'lodash';

/**
 * opinionAdvancedSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.searchParams the search params
 * @returns {Promise<*>} the promise of the api call
 */
export const opinionAdvancedSearchInteractor = (
  applicationContext,
  {
    searchParams,
  }: {
    searchParams: {
      caseTitleOrPetitioner: string;
      dateRange: string;
      docketNumber: string;
      endDate: string;
      judge: string;
      keyword: string;
      opinionTypes: string[];
      startDate: string;
    };
  },
): Promise<RawInternalDocumentSearchResult[]> => {
  const opinionTypesQuery = searchParams.opinionTypes.join(',');

  return get({
    applicationContext,
    endpoint: '/case-documents/opinion-search',
    params: {
      ...omit(searchParams, 'opinionTypes'),
      opinionTypes: opinionTypesQuery,
    },
  });
};
