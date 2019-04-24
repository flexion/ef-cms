import { chooseWorkQueueSequence } from './chooseWorkQueueSequence';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { getCasesByUserAction } from '../actions/getCasesByUserAction';
import { getCasesForRespondentAction } from '../actions/getCasesForRespondentAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setCasesAction } from '../actions/setCasesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setUsersAction } from '../actions/setUsersAction';

import { getNotificationsAction } from '../actions/getNotificationsAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';

const goToDashboard = [
  setCurrentPageAction('Interstitial'),
  clearErrorAlertsAction,
  getUserRoleAction,
  {
    docketclerk: [
      getUsersInSectionAction({ section: 'docket' }),
      setUsersAction,
      getNotificationsAction,
      setNotificationsAction,
      setCurrentPageAction('DashboardDocketClerk'),
      ...chooseWorkQueueSequence,
    ],
    intakeclerk: [
      clearAlertsAction,
      setCurrentPageAction('DashboardIntakeClerk'),
    ],
    petitioner: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPetitioner'),
    ],
    petitionsclerk: [
      getUsersInSectionAction({ section: 'petitions' }),
      setUsersAction,
      getNotificationsAction,
      setNotificationsAction,
      setCurrentPageAction('DashboardPetitionsClerk'),
      ...chooseWorkQueueSequence,
    ],
    practitioner: [
      getCasesByUserAction,
      setCasesAction,
      setCurrentPageAction('DashboardPractitioner'),
    ],
    respondent: [
      clearAlertsAction,
      getCasesForRespondentAction,
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
