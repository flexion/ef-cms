import { clearFormAction } from '../actions/clearFormAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getFilterCurrentJudgeUsersAction } from '../actions/getFilterCurrentJudgeUsersAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { set } from 'cerebral/factories';
import { setCaseAction } from '../actions/setCaseAction';
import { setCourtIssuedDocumentInitialDataAction } from '../actions/CourtIssuedDocketEntry/setCourtIssuedDocumentInitialDataAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDefaultServiceStampAction } from '../actions/CourtIssuedDocketEntry/setDefaultServiceStampAction';
import { setDocketEntryIdAction } from '../actions/setDocketEntryIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setUsersByKeyAction } from '../actions/setUsersByKeyAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';

export const gotoAddCourtIssuedDocketEntrySequence = [
  isLoggedInAction,
  {
    isLoggedIn: [
      setCurrentPageAction('Interstitial'),
      stopShowValidationAction,
      clearFormAction,
      setRedirectUrlAction,
      getUsersInSectionAction({ section: 'judge' }),
      getFilterCurrentJudgeUsersAction,
      setUsersByKeyAction('judges'),
      getCaseAction,
      setCaseAction,
      setDocketEntryIdAction,
      setCourtIssuedDocumentInitialDataAction,
      setDefaultServiceStampAction,
      generateCourtIssuedDocumentTitleAction,
      set(state.isEditingDocketEntry, false),
      setCurrentPageAction('CourtIssuedDocketEntry'),
    ],
    unauthorized: [redirectToCognitoAction],
  },
];
