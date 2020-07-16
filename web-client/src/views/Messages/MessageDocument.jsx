import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const ConfirmServeToIrsModal = () => (
  <ConfirmModal
    cancelLabel="No, Take Me Back"
    confirmLabel="Yes, Serve"
    confirmSequenceProps={{ stayOnPage: true }}
    preventCancelOnBlur={true}
    title="Are You Sure You Want to Serve This Petition to the IRS?"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="serveCaseToIrsSequence"
  ></ConfirmModal>
);

export const MessageDocument = connect(
  {
    caseDetail: state.caseDetail,
    iframeSrc: state.iframeSrc,
    messageDocumentHelper: state.messageDocumentHelper,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence: sequences.openConfirmEditModalSequence,
    openConfirmEditSignatureModalSequence:
      sequences.openConfirmEditSignatureModalSequence,
    openConfirmServeToIrsModalSequence:
      sequences.openConfirmServeToIrsModalSequence,
    parentMessageId: state.parentMessageId,
    showModal: state.modal.showModal,
    viewerDocumentToDisplay: state.viewerDocumentToDisplay,
  },
  function MessageDocument({
    caseDetail,
    iframeSrc,
    messageDocumentHelper,
    openCaseDocumentDownloadUrlSequence,
    openConfirmEditModalSequence,
    openConfirmEditSignatureModalSequence,
    openConfirmServeToIrsModalSequence,
    parentMessageId,
    showModal,
    viewerDocumentToDisplay,
  }) {
    return (
      <div
        className={classNames(
          'document-viewer--documents',
          !viewerDocumentToDisplay && 'border border-base-lighter',
        )}
      >
        {!viewerDocumentToDisplay && (
          <div className="padding-2">There are no attachments to preview</div>
        )}

        {messageDocumentHelper.showDocumentNotSignedAlert && (
          <div className="text-align-right text-secondary-dark text-semibold margin-bottom-1">
            Signature required for this document.
          </div>
        )}

        {viewerDocumentToDisplay && (
          <>
            <div className="message-document-actions">
              {messageDocumentHelper.showEditButtonNotSigned && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDocumentToDisplay.documentId}/${parentMessageId}`}
                  icon="edit"
                >
                  Edit
                </Button>
              )}

              {messageDocumentHelper.showEditButtonSigned && (
                <Button
                  link
                  icon="edit"
                  onClick={() =>
                    openConfirmEditModalSequence({
                      docketNumber: caseDetail.docketNumber,
                      documentIdToEdit: viewerDocumentToDisplay.documentId,
                      parentMessageId,
                      redirectUrl: `/case-messages/${caseDetail.docketNumber}/message-detail/${parentMessageId}`,
                    })
                  }
                >
                  Edit
                </Button>
              )}

              {messageDocumentHelper.showEditCorrespondenceButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-correspondence/${viewerDocumentToDisplay.documentId}/${parentMessageId}`}
                  icon="edit"
                >
                  Edit
                </Button>
              )}

              {messageDocumentHelper.showApplySignatureButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDocumentToDisplay.documentId}/sign/${parentMessageId}`}
                  icon="pencil-alt"
                >
                  Apply Signature
                </Button>
              )}

              {messageDocumentHelper.showEditSignatureButton && (
                <Button
                  link
                  icon="pencil-alt"
                  onClick={() =>
                    openConfirmEditSignatureModalSequence({
                      documentIdToEdit: viewerDocumentToDisplay.documentId,
                    })
                  }
                >
                  Edit Signature
                </Button>
              )}

              {messageDocumentHelper.showAddDocketEntryButton && (
                <Button
                  link
                  href={`/case-detail/${caseDetail.docketNumber}/documents/${viewerDocumentToDisplay.documentId}/add-court-issued-docket-entry/${parentMessageId}`}
                  icon="plus-circle"
                >
                  Add Docket Entry
                </Button>
              )}

              {messageDocumentHelper.showNotServed && (
                <Button
                  link
                  icon="paper-plane"
                  iconColor="white"
                  onClick={() => {
                    openConfirmServeToIrsModalSequence();
                  }}
                >
                  Serve
                </Button>
              )}

              <Button
                link
                icon="file-pdf"
                iconColor="white"
                onClick={() =>
                  openCaseDocumentDownloadUrlSequence({
                    caseId: caseDetail.caseId,
                    documentId: viewerDocumentToDisplay.documentId,
                  })
                }
              >
                View Full PDF
              </Button>
            </div>
            {!process.env.CI && (
              <iframe
                src={iframeSrc}
                title={viewerDocumentToDisplay.documentTitle}
              />
            )}
            {showModal == 'ConfirmServeToIrsModal' && (
              <ConfirmServeToIrsModal />
            )}
          </>
        )}
      </div>
    );
  },
);
