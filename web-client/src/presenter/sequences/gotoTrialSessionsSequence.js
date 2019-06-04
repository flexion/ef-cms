import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getTrialSessionsAction } from '../actions/TrialSessions/getTrialSessionsAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setTrialSessionsAction } from '../actions/TrialSessions/setTrialSessionsAction';

const gotoTrialSessions = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearErrorAlertsAction,
  getTrialSessionsAction,
  setTrialSessionsAction,
  setCurrentPageAction('TrialSessions'),
];

export const gotoTrialSessionsSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoTrialSessions,
    unauthorized: [redirectToCognitoAction],
  },
];
