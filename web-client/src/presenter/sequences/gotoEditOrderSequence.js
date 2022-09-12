import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { convertHtml2PdfSequence } from './convertHtml2PdfSequence';
import { getCaseAction } from '../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getConstants } from '../../getConstants';
import { getDocumentContentsAction } from '../actions/getDocumentContentsAction';
import { getFeatureFlagValueFactoryAction } from '../actions/getFeatureFlagValueFactoryAction';
import { isLoggedInAction } from '../actions/isLoggedInAction';
import { parallel } from 'cerebral';
import { redirectToCognitoAction } from '../actions/redirectToCognitoAction';
import { setAddedDocketNumbersAction } from '../actions/setAddedDocketNumbersAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentToEditAction } from '../actions/setDocumentToEditAction';
import { setFormFromDraftStateAction } from '../actions/setFormFromDraftStateAction';
import { setParentMessageIdAction } from '../actions/setParentMessageIdAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { unsetDocumentToEditAction } from '../actions/unsetDocumentToEditAction';

const gotoEditOrder = startWebSocketConnectionSequenceDecorator([
  setRedirectUrlAction,
  unsetDocumentToEditAction,
  clearModalAction,
  setCurrentPageAction('Interstitial'),
  stopShowValidationAction,
  clearFormAction,
  getCaseAction,
  setCaseAction,
  getDocumentContentsAction,
  setFormFromDraftStateAction,
  setDocumentToEditAction,
  setParentMessageIdAction,
  convertHtml2PdfSequence,
  setAddedDocketNumbersAction,
  parallel([
    [getConsolidatedCasesByCaseAction, setConsolidatedCasesForCaseAction],
    getFeatureFlagValueFactoryAction(
      getConstants().ALLOWLIST_FEATURE_FLAGS
        .CONSOLIDATED_CASES_ADD_DOCKET_NUMBERS,
      true,
    ),
  ]),
  setCurrentPageAction('CreateOrder'),
]);

export const gotoEditOrderSequence = [
  isLoggedInAction,
  {
    isLoggedIn: gotoEditOrder,
    unauthorized: [redirectToCognitoAction],
  },
];
