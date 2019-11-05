import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearCompleteFormAction } from '../actions/clearCompleteFormAction';
import { completeWorkItemAction } from '../actions/completeWorkItemAction';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
import { refreshCaseAction } from '../actions/refreshCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetShowForwardInputs } from '../actions/unsetShowForwardInputs';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const submitCompleteSequence = [
  setWaitingForResponseAction,
  clearAlertsAction,
  completeWorkItemAction,
  refreshCaseAction,
  clearCompleteFormAction,
  unsetShowForwardInputs,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  unsetWaitingForResponseAction,
  navigateToMessagesAction,
];
