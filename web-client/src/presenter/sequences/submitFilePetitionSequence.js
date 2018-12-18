import clearAlerts from '../actions/clearAlertsAction';
import createCase from '../actions/createCaseAction';
import getCreateCaseAlertSuccess from '../actions/getCreateCaseAlertSuccessAction';
import navigateToDashboard from '../actions/navigateToDashboardAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';

export default [
  setFormSubmitting,
  clearAlerts,
  createCase,
  unsetFormSubmitting,
  getCreateCaseAlertSuccess,
  setAlertSuccess,
  navigateToDashboard,
];
