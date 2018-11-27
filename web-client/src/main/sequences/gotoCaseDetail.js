import clearAlerts from '../actions/clearAlerts';
import getCase from '../actions/getCase';
import getUserRole from '../actions/getUserRole';
import setBaseUrl from '../actions/setBaseUrl';
import setCase from '../actions/setCase';
import setCurrentPage from '../actions/setCurrentPage';

export const gotoCaseDetail = [
  setBaseUrl,
  clearAlerts,
  getCase,
  setCase,
  getUserRole,
  {
    taxpayer: [setCurrentPage('CaseDetail')],
    petitionsclerk: [setCurrentPage('ValidateCase')],
  },
];
