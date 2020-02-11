import { checkForActiveBatchesAction } from '../actions/checkForActiveBatchesAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { computeMailingDateAction } from '../actions/StartCaseInternal/computeMailingDateAction';
import { navigateToReviewPetitionAction } from '../actions/StartCaseInternal/navigateToReviewPetitionAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validatePetitionFromPaperAction } from '../actions/validatePetitionFromPaperAction';

export const navigateToReviewPetitionSequence = [
  checkForActiveBatchesAction,
  {
    hasActiveBatches: [setShowModalFactoryAction('UnfinishedScansModal')],
    noActiveBatches: [
      clearAlertsAction,
      startShowValidationAction,
      computeDateReceivedAction,
      computeMailingDateAction,
      validatePetitionFromPaperAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [stopShowValidationAction, navigateToReviewPetitionAction],
      },
    ],
  },
];
