import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

const gotoBlockedCasesReport = [
  setCurrentPageAction('Interstitial'),
  clearScreenMetadataAction,
  closeMobileMenuAction,
  clearErrorAlertsAction,
  setCurrentPageAction('BlockedCasesReport'),
];

export const gotoBlockedCasesReportSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoBlockedCasesReport,
    unauthorized: [redirectToCognitoAction],
  },
];
