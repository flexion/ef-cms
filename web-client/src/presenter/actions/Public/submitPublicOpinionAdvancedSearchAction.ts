import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { clone } from 'lodash';
import { state } from '@web-client/presenter/app-public.cerebral';
import { trimDocketNumberSearch } from '../setDocketNumberFromSearchAction';

/**
 * submit public opinion advanced search form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store
 * @returns {Promise} async action
 */
export const submitPublicOpinionAdvancedSearchAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps<{}, ClientPublicApplicationContext>) => {
  const searchParams: {
    docketNumber: string;
    opinionTypes: { [key: string]: boolean }[];
  } = clone(get(state.advancedSearchForm.opinionSearch));

  if (searchParams.docketNumber) {
    searchParams.docketNumber = trimDocketNumberSearch(
      searchParams.docketNumber,
    );
  }

  const opinionTypes = Object.keys(searchParams.opinionTypes).filter(
    opinionType => searchParams.opinionTypes[opinionType] === true,
  );

  try {
    const searchResults = await applicationContext
      .getUseCases()
      .opinionPublicSearchInteractor(applicationContext, {
        searchParams: {
          ...searchParams,
          opinionTypes,
        },
      });

    return { searchResults };
  } catch (err: any) {
    const ERROR: Error | { responseCode: number } = err;
    if ('responseCode' in ERROR && ERROR.responseCode === 429) {
      store.set(state.alertError, applicationContext.getConstants().ERROR_429);
      return { searchResults: [] };
    } else {
      throw ERROR;
    }
  }
};
