import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import clearCompleteFormAction from '../actions/clearCompleteFormAction';
import completeWorkItemAction from '../actions/completeWorkItemAction';
import setAlertSuccess from '../actions/setAlertSuccessAction';
import setFormSubmitting from '../actions/setFormSubmittingAction';
import unsetFormSubmitting from '../actions/unsetFormSubmittingAction';

export default [
  setFormSubmitting,
  clearAlertsAction,
  completeWorkItemAction,
  clearCompleteFormAction,
  set(state.document.showForwardInputs, false), // TODO
  setAlertSuccess,
  unsetFormSubmitting,
];
