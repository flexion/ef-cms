import { instantiatePDFFromUploadAction } from '../actions/FileDocument/instantiatePDFFromUploadAction';
import { selectDocumentForPreviewSequence } from './selectDocumentForPreviewSequence';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { setFormValueAction } from '../actions/setFormValueAction';
import { setIsScanningFalseAction } from '../actions/setIsScanningFalseAction';
import { updateOrderForCdsAction } from '../actions/StartCaseInternal/updateOrderForCdsAction';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';
import { validateFileAction } from '../actions/FileDocument/validateFileAction';

export const setDocumentForUploadSequence = [
  instantiatePDFFromUploadAction,
  setFormValueAction,
  validateFileAction,
  {
    error: [setIsScanningFalseAction],
    success: [
      updateOrderForDesignatingPlaceOfTrialAction,
      updateOrderForCdsAction,
      selectDocumentForPreviewSequence,
      setDocumentUploadModeSequence,
    ],
  },
];
