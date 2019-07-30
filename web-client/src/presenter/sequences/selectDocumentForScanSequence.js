import { selectDocumentForPreviewAction } from '../actions/selectDocumentForPreviewAction';
import { selectDocumentForScanAction } from '../actions/selectDocumentForScanAction';
import { set, unset } from 'cerebral/factories';
import { setPdfPreviewUrlSequence } from '../sequences/setPdfPreviewUrlSequence';
import { shouldShowPreviewAction } from '../actions/shouldShowPreviewAction';
import { state } from 'cerebral';

export const selectDocumentForScanSequence = [
  unset(state.documentSelectedForPreview),
  selectDocumentForScanAction,
  shouldShowPreviewAction,
  {
    no: [],
    yes: [
      selectDocumentForPreviewAction,
      ...setPdfPreviewUrlSequence,
      set(state.documentUploadMode, 'preview'),
    ],
  },
];
