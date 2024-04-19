import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getStep3DataAction } from '@web-client/presenter/actions/getStep3DataAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep3Action } from '@web-client/presenter/actions/validateUploadPetitionStep3Action';

export const updatedFilePetitionCompleteStep3Sequence = [
  startShowValidationAction,
  getStep3DataAction,
  validateUploadPetitionStep3Action,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: [
      clearAlertsAction,
      stopShowValidationAction,
      incrementCurrentStepIndicatorAction,
    ],
  },
];