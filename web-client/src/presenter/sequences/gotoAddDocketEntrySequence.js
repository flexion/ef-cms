import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

const gotoAddDocketEntry = [
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearAlertsAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  set(state.form.filingStatus, 'File'),
  setCurrentPageAction('AddDocketEntry'),
];

export const gotoAddDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoAddDocketEntry,
    unauthorized: [redirectToCognitoAction],
  },
];
