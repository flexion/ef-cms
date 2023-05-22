import { generatePdfFromScanSessionAction } from '../actions/generatePdfFromScanSessionAction';
import { instantiatePDFFromUploadAction } from '../actions/FileDocument/instantiatePDFFromUploadAction';
import { resetScanSessionAction } from '../actions/resetScanSessionAction';
import { selectDocumentForPreviewSequence } from './selectDocumentForPreviewSequence';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { setFormValueAction } from '../actions/setFormValueAction';
import { setIsScanningFalseAction } from '../actions/setIsScanningFalseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { validateFileAction } from '../actions/FileDocument/validateFileAction';
import { validatePetitionFromPaperSequence } from './validatePetitionFromPaperSequence';

export const generatePdfFromScanSessionSequence = showProgressSequenceDecorator(
  [
    generatePdfFromScanSessionAction,
    instantiatePDFFromUploadAction,
    setFormValueAction,
    validateFileAction,
    {
      error: [setIsScanningFalseAction],
      success: [
        validatePetitionFromPaperSequence,
        selectDocumentForPreviewSequence,
        setDocumentUploadModeSequence,
        resetScanSessionAction,
      ],
    },
  ],
);
