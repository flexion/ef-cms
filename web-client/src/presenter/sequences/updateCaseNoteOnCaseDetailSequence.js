import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setCaseNoteOnCaseDetailAction } from '../actions/TrialSession/setCaseNoteOnCaseDetailAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateCaseNoteAction } from '../actions/TrialSession/updateCaseNoteAction';
import { updateNotePropsFromModalStateAction } from '../actions/TrialSessionWorkingCopy/updateNotePropsFromModalStateAction';
import { validateCaseNoteAction } from '../actions/Cases/validateCaseNoteAction';

export const updateCaseNoteOnCaseDetailSequence = [
  startShowValidationAction,
  validateCaseNoteAction,
  {
    error: [setValidationErrorsAction],
    success: [
      stopShowValidationAction,
      clearAlertsAction,
      updateNotePropsFromModalStateAction,
      updateCaseNoteAction,
      setCaseNoteOnCaseDetailAction,
      clearModalAction,
      clearModalStateAction,
    ],
  },
];
