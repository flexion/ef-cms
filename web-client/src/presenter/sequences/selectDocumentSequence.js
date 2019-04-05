import { set } from 'cerebral/factories';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { state } from 'cerebral';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const selectDocumentSequence = [
  set(state.showValidation, true),
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [
      set(state.showValidation, false),
      set(state.form.isDocumentTypeSelected, true),
    ],
  },
];
