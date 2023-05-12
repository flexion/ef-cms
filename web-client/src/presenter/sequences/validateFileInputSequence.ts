import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getPDFTextAction } from '../actions/FileDocument/getPDFTextAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateFileAction } from '../actions/FileDocument/validateFileAction';

export const validateFileInputSequence = [
  getPDFTextAction,
  validateFileAction,
  {
    error: [
      startShowValidationAction,
      setAlertErrorAction,
      setValidationErrorsAction,
    ],
    success: [stopShowValidationAction, clearAlertsAction],
  },
];
