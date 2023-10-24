import { ModalDialog } from '@web-client/views/ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ReprintPaperServiceDocumentsModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    form: state.modal.form,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    openSelectedPDFsSequence: sequences.openSelectedPDFsSequence,
    updatePDFsSelectedForPrintSequence:
      sequences.updatePDFsSelectedForPrintSequence,
  },
  function ReprintPaperServiceDocumentsModal({
    clearModalSequence,
    form,
    formattedTrialSessionDetails,
    openSelectedPDFsSequence,
    updatePDFsSelectedForPrintSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={clearModalSequence}
        confirmLabel="Open PDF"
        confirmSequence={openSelectedPDFsSequence}
        message="Select the PDF(s) that you would like to print. They will open in seperate tabs and be available for three days after the PDF was originally generated."
        title="Print Paper Service PDF"
      >
        {formattedTrialSessionDetails.paperServicePdfs.map(pdfInfo => {
          return (
            <div className="usa-checkbox" key={pdfInfo.fileId}>
              <input
                checked={form.selectedPdfs.includes(pdfInfo.fileId) || false}
                className="usa-checkbox__input"
                id={`${pdfInfo.fileId}`}
                name={`${pdfInfo.fileId}`}
                type="checkbox"
                onChange={e => {
                  updatePDFsSelectedForPrintSequence({
                    key: e.target.name,
                  });
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor={`${pdfInfo.fileId}`}
              >
                {pdfInfo.title}
              </label>
            </div>
          );
        })}
      </ModalDialog>
    );
  },
);

ReprintPaperServiceDocumentsModal.displayName =
  'ReprintPaperServiceDocumentsModal';
