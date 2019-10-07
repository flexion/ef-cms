import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { submitCaseAssociationRequestAction } from '../actions/FileDocument/submitCaseAssociationRequestAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';

export const submitCaseAssociationRequestSequence = [
  openFileUploadStatusModalAction,
  uploadExternalDocumentsAction,
  {
    error: [openFileUploadErrorModal],
    success: [
      submitCaseAssociationRequestAction,
      setCaseAction,
      closeFileUploadStatusModalAction,
      getFileExternalDocumentAlertSuccessAction,
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToCaseDetailAction,
    ],
  },
];
