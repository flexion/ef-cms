import { DocumentSearch } from '@shared/business/entities/documents/DocumentSearch';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { MAX_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
import {
  PublicDocumentSearchResult,
  RawPublicDocumentSearchResult,
} from '@shared/business/entities/documents/PublicDocumentSearchResult';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { omit } from 'lodash';

export const opinionPublicSearchInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    opinionTypes,
    startDate,
  }: {
    caseTitleOrPetitioner: string;
    dateRange: string;
    docketNumber: string;
    endDate: string;
    judge: string;
    keyword: string;
    opinionTypes: string[];
    startDate: string;
  },
): Promise<RawPublicDocumentSearchResult[]> => {
  const opinionSearch = new DocumentSearch({
    caseTitleOrPetitioner,
    dateRange,
    docketNumber,
    endDate,
    judge,
    keyword,
    startDate,
  });

  const rawSearch = opinionSearch.validate().toRawObject();

  const { results, totalCount } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: opinionTypes,
      isOpinionSearch: true,
      ...rawSearch,
    });

  const timestamp = formatNow(FORMATS.LOG_TIMESTAMP);
  applicationContext.logger.info('public opinion search', {
    ...omit(rawSearch, 'entityName'),
    timestamp,
    totalCount,
  });

  const filteredResults = results.slice(0, MAX_SEARCH_RESULTS);

  return PublicDocumentSearchResult.validateRawCollection(filteredResults);
};
