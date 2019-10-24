import { chooseWorkQueueSequence } from './chooseWorkQueueSequence';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getCasesByUserAction } from '../actions/getCasesByUserAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUserAction } from '../actions/getUserAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { navigateToMessagesAction } from '../actions/navigateToMessagesAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCasesAction } from '../actions/setCasesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setMessageInboxPropsAction } from '../actions/setMessageInboxPropsAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUserAction } from '../actions/setUserAction';
import { setUserPermissionsAction } from '../actions/setUserPermissionsAction';
import { state } from 'cerebral';

const goToDashboard = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  getUserAction,
  setUserAction,
  setUserPermissionsAction,
  set(state.selectedWorkItems, []),
  clearErrorAlertsAction,
  getUserRoleAction,
  {
    docketclerk: [navigateToMessagesAction],
    judge: [
      setMessageInboxPropsAction,
      ...chooseWorkQueueSequence,
      getTrialSessionsAction,
      setTrialSessionsAction,
      setCurrentPageAction('DashboardJudge'),
    ],
    otherInternalUser: [navigateToMessagesAction],
    petitioner: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPetitioner'),
    ],
    petitionsclerk: [navigateToMessagesAction],
    practitioner: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPractitioner'),
    ],
    respondent: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardRespondent'),
    ],
  },
];

export const gotoDashboardSequence = [
  isLoggedInAction,
  {
    isLoggedIn: goToDashboard,
    unauthorized: [redirectToCognitoAction],
  },
];
