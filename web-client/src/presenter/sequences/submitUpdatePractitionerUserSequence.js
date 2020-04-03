import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updatePractitionerUserAction } from '../actions/updatePractitionerUserAction';
import { validatePractitionerUserAction } from '../actions/validatePractitionerUserAction';

export const submitUpdatePractitionerUserSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePractitionerUserAction,
  {
    error: [setAlertErrorAction],
    success: [
      setCurrentPageAction('Interstitial'),
      updatePractitionerUserAction,
      {
        error: [],
        success: [setAlertSuccessAction, setSaveAlertsForNavigationAction],
      },
    ],
  },
];
