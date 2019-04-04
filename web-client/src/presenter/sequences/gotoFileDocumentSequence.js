import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const gotoFileDocument = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  getCaseAction,
  setCaseAction,
  clearFormAction,
  setCurrentPageAction('FileDocument'),
];

export const gotoFileDocumentSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoFileDocument,
    unauthorized: [redirectToCognitoAction],
  },
];
