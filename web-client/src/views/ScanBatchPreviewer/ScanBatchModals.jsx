import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const EmptyHopperModal = connect(
  {},
  () => {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Scan"
        title="The Hopper is empty"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="startScanSequence"
      >
        Please load the hopper to scan your batch.
      </ConfirmModal>
    );
  },
);

export const ConfirmRescanBatchModal = connect(
  { batchIndex: state.batchIndexToRescan },
  ({ batchIndex }) => (
    <ConfirmModal
      cancelLabel="No, cancel"
      confirmLabel="Yes, rescan"
      title={`Rescan Batch ${batchIndex + 1}`}
      onCancelSequence="clearModalSequence"
      onConfirmSequence="rescanBatchSequence"
    >
      Are you sure you want to rescan batch {batchIndex + 1}?
    </ConfirmModal>
  ),
);
export const DeleteBatchModal = connect(
  {
    batchIndex: state.batchIndexToDelete,
    pageCount: state.batchToDeletePageCount,
  },
  ({ batchIndex, pageCount }) => {
    return (
      <ConfirmModal
        cancelLabel="No, cancel"
        confirmLabel="Yes, delete"
        title={`Are you sure you want to delete Batch ${batchIndex + 1}?`}
        onCancelSequence="clearModalSequence"
        onConfirmSequence="removeBatchSequence"
      >
        <p>
          This will delete {pageCount} {pageCount === 1 ? 'page' : 'pages'} from
          your document.
        </p>
      </ConfirmModal>
    );
  },
);
export const DeletePDFModal = connect(
  {},
  () => {
    return (
      <ConfirmModal
        cancelLabel="No, cancel"
        confirmLabel="Yes, delete"
        title="Are you sure you want to delete this PDF?"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="removeScannedPdfSequence"
      >
        <p>This action cannot be undone.</p>
      </ConfirmModal>
    );
  },
);
export const ScanErrorModal = connect(
  {},
  () => {
    return (
      <ConfirmModal
        noCancel
        confirmLabel="OK"
        title="An error occured while scanning"
        onConfirmSequence="clearModalSequence"
      >
        Please try again or contact your IT Administrator.
      </ConfirmModal>
    );
  },
);
export const UnfinishedScansModal = connect(
  {},
  () => (
    <ConfirmModal
      cancelLabel="Cancel"
      confirmLabel="OK"
      title="You Have Unfinished Scans"
      onCancelSequence="clearModalSequence"
      onConfirmSequence="clearModalSequence"
    >
      If you continue, your unfinished scans will be lost.
    </ConfirmModal>
  ),
);
