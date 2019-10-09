import { chooseWorkQueueSequence } from './chooseWorkQueueSequence';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUsersAction } from '../actions/setUsersAction';
import { state } from 'cerebral';

const goToMessages = [
  setCurrentPageAction('Interstitial'),
  closeMobileMenuAction,
  set(state.selectedWorkItems, []),
  clearErrorAlertsAction,
  getUserRoleAction,
  {
    docketclerk: [
      getUsersInSectionAction({ section: 'docket' }),
      setUsersAction,
    ],
    judge: [getTrialSessionsAction, setTrialSessionsAction],
    petitionsclerk: [
      getUsersInSectionAction({ section: 'petitions' }),
      setUsersAction,
    ],
    seniorattorney: [],
  },
  setCurrentPageAction('Messages'),
  ...chooseWorkQueueSequence,
];

export const gotoMessagesSequence = [
  isLoggedInAction,
  {
    isLoggedIn: goToMessages,
    unauthorized: [redirectToCognitoAction],
  },
];
