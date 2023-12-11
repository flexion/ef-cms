import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getIrsPractitionerUsersAction } from '@web-client/presenter/actions/TrialSession/getIrsPractitionerUsersAction';
import { getSetJudgesSequence } from './getSetJudgesSequence';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral/factories';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setDefaultTrialSessionFormValuesAction } from '../actions/setDefaultTrialSessionFormValuesAction';
import { setIrsPractitionerUsersAction } from '@web-client/presenter/actions/TrialSession/setIrsPractitionerUsersAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

const gotoAddTrialSession = [
  setupCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  clearScreenMetadataAction,
  parallel([
    [getTrialSessionsAction, setTrialSessionsAction],
    [getIrsPractitionerUsersAction, setIrsPractitionerUsersAction],
    getSetJudgesSequence,
    [
      getUsersInSectionAction({ section: 'trialClerks' }),
      setUsersByKeyAction('trialClerks'),
    ],
  ]),
  setDefaultTrialSessionFormValuesAction,
  setupCurrentPageAction('AddTrialSession'),
];

export const gotoAddTrialSessionSequence = [
  isLoggedInAction,
  {
    isLoggedIn: startWebSocketConnectionSequenceDecorator(gotoAddTrialSession),
    unauthorized: [redirectToCognitoAction],
  },
];
