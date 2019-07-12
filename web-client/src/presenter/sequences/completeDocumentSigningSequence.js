import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { createWorkItemSequence } from './createWorkItemSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { parallel } from 'cerebral';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { validateInitialWorkItemMessageAction } from '../actions/validateInitialWorkItemMessageAction';

export const completeDocumentSigningSequence = [
  clearAlertsAction,
  validateInitialWorkItemMessageAction,
  {
    error: [setValidationErrorsAction],
    success: [
      completeDocumentSigningAction,
      parallel([setDocumentIdAction, setDocumentDetailTabAction]),
      ...createWorkItemSequence,
      clearPDFSignatureDataAction,
      clearFormAction,
      navigateToCaseDetailAction,
    ],
  },
];
