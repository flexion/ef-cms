import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updatePrimaryContactAction } from '../actions/updatePrimaryContactAction';
import { validatePetitionerAction } from '../actions/validatePetitionerAction';

export const submitEditPetitionerSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePetitionerAction,
  {
    error: [setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      updatePrimaryContactAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      setCaseDetailPageTabFrozenAction,
      setCurrentPageAction('Interstitial'),
      navigateToCaseDetailAction,
    ]),
  },
];
