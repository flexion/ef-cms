import { chooseWorkQueueSequence } from './chooseWorkQueueSequence';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCasesByUserAction } from '../actions/getCasesByUserAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCasesAction } from '../actions/setCasesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUsersAction } from '../actions/setUsersAction';
import { state } from 'cerebral';

const goToDashboard = [
  setCurrentPageAction('Interstitial'),
  set(state.selectedWorkItems, []),
  clearErrorAlertsAction,
  getUserRoleAction,
  {
    docketclerk: [
      parallel([
        [getUsersInSectionAction({ section: 'docket' }), setUsersAction],
        [
          setCurrentPageAction('DashboardDocketClerk'),
          ...chooseWorkQueueSequence,
        ],
      ]),
    ],
    judge: [
      ...chooseWorkQueueSequence,
      getTrialSessionsAction,
      setTrialSessionsAction,
      setCurrentPageAction('DashboardJudge'),
    ],
    petitioner: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPetitioner'),
    ],
    petitionsclerk: [
      parallel([
        [getUsersInSectionAction({ section: 'petitions' }), setUsersAction],
        [
          setCurrentPageAction('DashboardPetitionsClerk'),
          ...chooseWorkQueueSequence,
        ],
      ]),
    ],
    practitioner: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPractitioner'),
    ],
    respondent: [
      clearAlertsAction,
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardRespondent'),
    ],
    seniorattorney: [
      clearAlertsAction,
      setCurrentPageAction('DashboardSeniorAttorney'),
      ...chooseWorkQueueSequence,
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
