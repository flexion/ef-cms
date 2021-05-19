import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabFrozenAction } from '../actions/CaseDetail/setCaseDetailPageTabFrozenAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateContactAction } from '../actions/updateContactAction';
import { validateContactAction } from '../actions/validateContactAction';

export const submitEditContactSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateContactAction,
  {
    error: [setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      updateContactAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      setCaseDetailPageTabFrozenAction,
      setCurrentPageAction('Interstitial'),
      navigateToCaseDetailAction,
    ]),
  },
];
