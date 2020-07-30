import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearPDFSignatureDataAction } from '../actions/clearPDFSignatureDataAction';
import { completeDocumentSigningAction } from '../actions/completeDocumentSigningAction';
import { completeWorkItemForDocumentSigningAction } from '../actions/completeWorkItemForDocumentSigningAction';
import { followRedirectAction } from '../actions/followRedirectAction';
import { navigateToDraftDocumentsAction } from '../actions/navigateToDraftDocumentsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseDetailPageTabActionGenerator } from '../actions/setCaseDetailPageTabActionGenerator';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setRedirectUrlAction } from '../actions/setRedirectUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setSuccessFromDocumentTitleAction } from '../actions/setSuccessFromDocumentTitleAction';
import { setViewerDraftDocumentToDisplayAction } from '../actions/setViewerDraftDocumentToDisplayAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveDocumentSigningSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  setSaveAlertsForNavigationAction,
  setSuccessFromDocumentTitleAction,
  completeDocumentSigningAction,
  setRedirectUrlAction,
  completeWorkItemForDocumentSigningAction,
  setDocumentDetailTabAction,
  clearPDFSignatureDataAction,
  clearFormAction,
  setAlertSuccessAction,
  followRedirectAction,
  {
    default: [
      setCaseDetailPageTabActionGenerator('drafts'),
      navigateToDraftDocumentsAction,
    ],
    success: [],
  },
]);
