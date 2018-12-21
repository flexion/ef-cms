import clearAlerts from '../actions/clearAlertsAction';
import getCase from '../actions/getCaseAction';
import setCase from '../actions/setCaseAction';
import setDocumentId from '../actions/setDocumentIdAction';
import setCurrentPage from '../actions/setCurrentPageAction';
import getDocumentUrl from '../actions/getDocumentUrlAction';

export default [
  clearAlerts,
  setDocumentId,
  getCase,
  setCase,
  getDocumentUrl,
  setCurrentPage('DocumentDetail'),
];
