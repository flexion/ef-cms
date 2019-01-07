import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import getUsersInSection from '../actions/getUsersInSectionAction';
import setAlertError from '../actions/setAlertErrorAction';
import setBaseUrl from '../actions/setBaseUrlAction';
import setCase from '../actions/setCaseAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import setDocumentId from '../actions/setDocumentIdAction';
import clearWorkItemActionMap from '../actions/clearWorkItemActionMapAction';
import clearForms from '../actions/clearFormsAction';
import setInternalUsers from '../actions/setInternalUsersAction';

export default [
  clearAlerts,
  clearWorkItemActionMap,
  clearForms,
  setDocumentId,
  getCase,
  setCase,
  setBaseUrl,
  getUsersInSection(),
  {
    error: [setAlertError],
    success: [setInternalUsers],
  },
  setCurrentPage('DocumentDetail'),
];
