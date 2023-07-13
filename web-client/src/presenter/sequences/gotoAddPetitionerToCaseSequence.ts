import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setupCurrentPageAction';
import { setDefaultAddPetitionerToCaseFormAction } from '../actions/setDefaultAddPetitionerToCaseFormAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddPetitionerToCaseSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator([
      setCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      clearFormAction,
      getCaseAction,
      setCaseAction,
      setDefaultAddPetitionerToCaseFormAction,
      setCurrentPageAction('AddPetitionerToCase'),
    ]),
    unauthorized: [redirectToCognitoAction],
  },
];
