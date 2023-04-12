import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../../actions/clearErrorAlertsAction';
import { getJudgeActivityReportAction } from '../../actions/JudgeActivityReport/getJudgeActivityReportAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setJudgeActivityReportDataAction } from '../../actions/JudgeActivityReport/setJudgeActivityReportDataAction';
import { setValidationAlertErrorsAction } from '../../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { stopShowValidationAction } from '../../actions/stopShowValidationAction';
import { validateJudgeActivityReportSearchAction } from '../../actions/JudgeActivityReport/validateJudgeActivityReportSearchAction';

export const submitJudgeActivityReportSequence = showProgressSequenceDecorator([
  startShowValidationAction,
  validateJudgeActivityReportSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      stopShowValidationAction,
      clearErrorAlertsAction,
      clearAlertsAction,
      getJudgeActivityReportAction,
      setJudgeActivityReportDataAction,
    ],
  },
]);
