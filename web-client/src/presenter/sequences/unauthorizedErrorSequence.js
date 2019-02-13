import setAlertFromExceptionAction from '../actions/setAlertFromExceptionAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';
import getEnvironment from '../actions/getEnvironmentAction';
import redirectToCognito from '../actions/redirectToCognitoAction';

export default [
  unsetFormSubmitting,
  setAlertFromExceptionAction,
  getEnvironment,
  {
    local: [setCurrentPage('Error')],
    prod: [redirectToCognito],
  },
];
