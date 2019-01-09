import clearAlerts from '../actions/clearAlertsAction';
import clearPetition from '../actions/clearPetitionAction';
import setAlertError from '../actions/setAlertErrorAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import getCaseTypes from '../actions/getCaseTypesAction';
import setCaseTypes from '../actions/setCaseTypesAction';
import getProcedureTypes from '../actions/getProcedureTypesAction';
import setProcedureTypes from '../actions/setProcedureTypesAction';

export default [
  clearAlerts,
  clearPetition,
  getCaseTypes,
  {
    error: [setAlertError],
    success: [setCaseTypes],
  },
  getProcedureTypes,
  {
    error: [setAlertError],
    success: [setProcedureTypes],
  },
  setCurrentPage('FilePetition'),
];
