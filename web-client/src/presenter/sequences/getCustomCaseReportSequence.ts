import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCustomCaseReportAction } from '../actions/CaseInventoryReport/getCustomCaseReportAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateCustomCaseReportFiltersAction } from '@web-client/presenter/actions/validateCustomCaseReportFiltersAction';

export const getCustomCaseReportSequence = [
  setWaitingForResponseAction,
  startShowValidationAction,
  validateCustomCaseReportFiltersAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      stopShowValidationAction,
      clearErrorAlertsAction,
      clearAlertsAction,
      getCustomCaseReportAction,
    ],
  },
  unsetWaitingForResponseAction,
] as unknown as (props: { selectedPage: number }) => void;
