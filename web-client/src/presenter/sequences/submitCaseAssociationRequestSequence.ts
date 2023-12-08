import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { debounceSequenceDecorator } from '@web-client/presenter/utilities/debounceSequenceDecorator';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { getPrintableFilingReceiptSequence } from './getPrintableFilingReceiptSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setDocumentFileForAutoGeneratedEntryOfAppearanceAction } from '../actions/FileDocument/setDocumentFileForAutoGeneratedEntryOfAppearanceAction';
import { setPractitionerOnFormAction } from '../actions/FileDocument/setPractitionerOnFormAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitCaseAssociationRequestAction } from '../actions/FileDocument/submitCaseAssociationRequestAction';
import { unsetRequestAccessWizardStepAction } from '../actions/unsetRequestAccessWizardStepAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';

export const submitCaseAssociationRequestSequence = debounceSequenceDecorator(
  500,
  [
    setDocumentFileForAutoGeneratedEntryOfAppearanceAction,
    openFileUploadStatusModalAction,
    setPractitionerOnFormAction,
    uploadExternalDocumentsAction,
    {
      error: [openFileUploadErrorModal],
      success: showProgressSequenceDecorator([
        submitCaseAssociationRequestAction,
        setCaseAction,
        closeFileUploadStatusModalAction,
        getPrintableFilingReceiptSequence,
        getFileExternalDocumentAlertSuccessAction,
        unsetRequestAccessWizardStepAction,
        setAlertSuccessAction,
        setSaveAlertsForNavigationAction,
        navigateToCaseDetailAction,
      ]),
    },
  ],
);
