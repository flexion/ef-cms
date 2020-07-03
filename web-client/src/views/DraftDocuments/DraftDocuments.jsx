import { ArchiveDraftDocumentModal } from './ArchiveDraftDocumentModal';
import { ConfirmEditModal } from './ConfirmEditModal';
import { DraftDocumentViewer } from '../DocketRecord/DraftDocumentViewer';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DraftDocuments = connect(
  {
    archiveDraftDocumentModalSequence:
      sequences.archiveDraftDocumentModalSequence,
    formattedCaseDetail: state.formattedCaseDetail,
    openConfirmEditModalSequence: sequences.openConfirmEditModalSequence,
    setViewerDocumentToDisplaySequence:
      sequences.setViewerDocumentToDisplaySequence,
    showModal: state.modal.showModal,
    viewerDocumentToDisplay: state.viewerDocumentToDisplay,
  },
  function DraftDocuments({ formattedCaseDetail, showModal }) {
    return (
      <>
        {formattedCaseDetail.formattedDraftDocuments.length === 0 && (
          <p>There are no draft documents.</p>
        )}
        {formattedCaseDetail.formattedDraftDocuments.length > 0 && (
          <DraftDocumentViewer />
        )}
        {showModal === 'ArchiveDraftDocumentModal' && (
          <ArchiveDraftDocumentModal />
        )}
        {showModal === 'ConfirmEditModal' && (
          <ConfirmEditModal confirmSequence="navigateToEditOrderSequence" />
        )}
      </>
    );
  },
);
