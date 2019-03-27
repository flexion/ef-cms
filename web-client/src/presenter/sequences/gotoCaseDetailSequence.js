import { state } from 'cerebral';
import { set } from 'cerebral/factories';

import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getUserRoleAction } from '../actions/getUserRoleAction';
import { setBaseUrlAction } from '../actions/setBaseUrlAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const gotoCaseDetailSequence = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  getCaseAction,
  setCaseAction,
  set(state.documentDetail.tab, 'docketRecord'),
  setBaseUrlAction,
  getUserRoleAction,
  {
    docketclerk: [setCurrentPageAction('CaseDetailInternal')],
    intakeclerk: [setCurrentPageAction('CaseDetailInternal')],
    petitioner: [setCurrentPageAction('CaseDetailPublic')],
    petitionsclerk: [setCurrentPageAction('CaseDetailInternal')],
    practitioner: [setCurrentPageAction('CaseDetailPublic')],
    respondent: [setCurrentPageAction('CaseDetailRespondent')],
    seniorattorney: [setCurrentPageAction('CaseDetailInternal')],
  },
];
