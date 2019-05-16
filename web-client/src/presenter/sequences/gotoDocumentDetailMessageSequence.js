import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormsAction } from '../actions/clearFormsAction';
import { clearWorkItemActionMapAction } from '../actions/clearWorkItemActionMapAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getCaseTypesAction } from '../actions/getCaseTypesAction';
import { getInternalUsersAction } from '../actions/getInternalUsersAction';
import { getNotificationsAction } from '../actions/getNotificationsAction';
import { getProcedureTypesAction } from '../actions/getProcedureTypesAction';
import { parallel } from 'cerebral/factories';
import { set } from 'cerebral/factories';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseTypesAction } from '../actions/setCaseTypesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setFormForCaseAction } from '../actions/setFormForCaseAction';
import { setInternalUsersAction } from '../actions/setInternalUsersAction';
import { setMessageIdFromUrlAction } from '../actions/setMessageIdFromUrlAction';
import { setNotificationsAction } from '../actions/setNotificationsAction';
import { setProcedureTypesAction } from '../actions/setProcedureTypesAction';
import { setWorkItemAsReadAction } from '../actions/setWorkItemAsReadAction';
import { setWorkItemIdFromMessageIdAction } from '../actions/setWorkItemIdFromMessageIdAction';
import { state } from 'cerebral';

export const gotoDocumentDetailMessageSequence = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  clearWorkItemActionMapAction,
  clearFormsAction,
  setBaseUrlAction,
  setMessageIdFromUrlAction,
  setDocumentIdAction,
  parallel([
    [
      getCaseAction,
      setCaseAction,
      setWorkItemIdFromMessageIdAction,
      setFormForCaseAction,
      setWorkItemAsReadAction,
      getNotificationsAction,
      setNotificationsAction,
    ],
    [getInternalUsersAction, setInternalUsersAction],
  ]),
  set(state.currentTab, 'Messages'),
  getProcedureTypesAction,
  setProcedureTypesAction,
  getCaseTypesAction,
  setCaseTypesAction,
  setCurrentPageAction('DocumentDetail'),
];
