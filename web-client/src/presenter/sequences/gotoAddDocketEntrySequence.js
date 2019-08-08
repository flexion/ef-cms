import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearScansAction } from '../actions/clearScansAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';

export const gotoAddDocketEntry = [
  setCurrentPageAction('Interstitial'),
  set(state.showValidation, false),
  clearScansAction,
  clearAlertsAction,
  clearFormAction,
  clearScreenMetadataAction,
  getCaseAction,
  setCaseAction,
  set(state.form.lodged, false),
  set(state.form.practitioner, []),
  set(state.wizardStep, 'PrimaryDocumentForm'),
  set(state.documentUploadMode, 'scan'),
  set(state.documentSelectedForScan, 'primaryDocumentFile'),
  setCurrentPageAction('AddDocketEntry'),
];

export const gotoAddDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoAddDocketEntry,
    unauthorized: [redirectToCognitoAction],
  },
];
