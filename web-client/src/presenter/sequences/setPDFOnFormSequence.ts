import { clearAlertsAction } from '../actions/clearAlertsAction';
import { instantiatePDFFromUploadAction } from '../actions/FileDocument/instantiatePDFFromUploadAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateFileAction } from '../actions/FileDocument/validateFileAction';

export const setPDFOnFormSequence = [
  instantiatePDFFromUploadAction,
  setFormValueAction,
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
