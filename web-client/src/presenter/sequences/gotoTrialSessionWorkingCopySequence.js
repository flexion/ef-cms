import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { extractNotesFromCalendaredCasesAction } from '../actions/TrialSession/extractNotesFromCalendaredCasesAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { getTrialSessionWorkingCopyAction } from '../actions/TrialSession/getTrialSessionWorkingCopyAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { gotoTrialSessionDetailSequence } from './gotoTrialSessionDetailSequence';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { isUserAssociatedWithTrialSessionAction } from '../actions/TrialSession/isUserAssociatedWithTrialSessionAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { runPathForUserRoleAction } from '../actions/runPathForUserRoleAction';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultWorkingCopyValuesAction } from '../actions/TrialSessionWorkingCopy/setDefaultWorkingCopyValuesAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';
import { setTrialSessionIdAction } from '../actions/TrialSession/setTrialSessionIdAction';
import { setTrialSessionWorkingCopyAction } from '../actions/TrialSession/setTrialSessionWorkingCopyAction';
import { setUsersAction } from '../actions/setUsersAction';
import { takePathForRoles } from './takePathForRoles';

const checkUserAssociationAndProceed = [
  isUserAssociatedWithTrialSessionAction,
  {
    no: [...gotoTrialSessionDetailSequence],
    yes: [
      getTrialSessionWorkingCopyAction,
      setTrialSessionWorkingCopyAction,
      setDefaultWorkingCopyValuesAction,
      isTrialSessionCalendaredAction,
      {
        no: [],
        yes: [
          getCalendaredCasesForTrialSessionAction,
          setCalendaredCasesOnTrialSessionAction,
          extractNotesFromCalendaredCasesAction,
        ],
      },
      setCurrentPageAction('TrialSessionWorkingCopy'),
    ],
  },
];

const gotoTrialSessionDetails = [
  setCurrentPageAction('Interstitial'),
  clearErrorAlertsAction,
  setBaseUrlAction,
  setTrialSessionIdAction,
  getTrialSessionDetailsAction,
  setTrialSessionDetailsAction,
  runPathForUserRoleAction,
  {
    ...takePathForRoles(
      [
        'adc',
        'admissionsclerk',
        'calendarclerk',
        'clerkofcourt',
        'docketclerk',
        'petitionsclerk',
        'trialclerk',
      ],
      gotoTrialSessionDetailSequence,
    ),
    chambers: [
      getUsersInSectionAction({}),
      setUsersAction,
      ...checkUserAssociationAndProceed,
    ],
    judge: checkUserAssociationAndProceed,
  },
];

export const gotoTrialSessionWorkingCopySequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoTrialSessionDetails,
    unauthorized: [redirectToCognitoAction],
  },
];
