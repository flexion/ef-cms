import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { getInternalOrderSearchEnabledAction } from '../actions/getInternalOrderSearchEnabledAction';
import { setAdvancedSearchResultsAction } from '../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setDefaultAdvancedSearchTabAction } from '../actions/setDefaultAdvancedSearchTabAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitOrderAdvancedSearchAction } from '../actions/AdvancedSearch/submitOrderAdvancedSearchAction';
import { validateOrderAdvancedSearchAction } from '../actions/AdvancedSearch/validateOrderAdvancedSearchAction';

export const submitOrderAdvancedSearchSequence = showProgressSequenceDecorator([
  getInternalOrderSearchEnabledAction,
  {
    no: [setAlertWarningAction, setDefaultAdvancedSearchTabAction],
    yes: [
      clearSearchTermAction,
      validateOrderAdvancedSearchAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          clearSearchResultsAction,
          startShowValidationAction,
        ],
        success: [
          clearAlertsAction,
          submitOrderAdvancedSearchAction,
          setAdvancedSearchResultsAction,
        ],
      },
    ],
  },
]);
