import { clearAlertsAction } from '../actions/clearAlertsAction';
import { instantiatePDFFromUploadAction } from '../actions/FileDocument/instantiatePDFFromUploadAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateFileAction } from '../actions/FileDocument/validateFileAction';

export const validateFileInputSequence = [
  instantiatePDFFromUploadAction,
  setFormValueAction,
  validateFileAction,
  {
    error: [
      startShowValidationAction,
      setValidationAlertErrorsAction,
      setValidationErrorsAction,
    ],
    success: [clearAlertsAction],
  },
];
