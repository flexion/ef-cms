import { clone } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';

/**
 * submit advanced search form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitOrderAdvancedSearchAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const searchParams = clone<{
    caseTitleOrPetitioner: string;
    dateRange: string;
    docketNumber: string;
    endDate: string;
    from: string;
    judge: string;
    keyword: string;
    startDate: string;
  }>(get(state.advancedSearchForm.orderSearch));

  if (searchParams.docketNumber) {
    searchParams.docketNumber = trimDocketNumberSearch(
      searchParams.docketNumber,
    );
  }

  try {
    const searchResults = await applicationContext
      .getUseCases()
      .orderAdvancedSearchInteractor(applicationContext, {
        searchParams,
      });
    return { searchResults };
  } catch (err: any) {
    const ERROR: { responseCode: number } = err;
    if (ERROR.responseCode === 429) {
      store.set(state.alertError, applicationContext.getConstants().ERROR_429);
      return { searchResults: [] };
    } else {
      throw ERROR;
    }
  }
};
