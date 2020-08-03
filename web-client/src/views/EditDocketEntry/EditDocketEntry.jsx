import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CreateCaseMessageModalDialog } from '../Messages/CreateCaseMessageModalDialog';
import { DocumentDisplayIframe } from '../DocumentDisplayIframe';
import { ErrorNotification } from '../ErrorNotification';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntry = connect(
  {
    completeDocketEntryQCSequence: sequences.completeDocketEntryQCSequence,
    editDocketEntryHelper: state.editDocketEntryHelper,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openCompleteAndSendCaseMessageModalSequence:
      sequences.openCompleteAndSendCaseMessageModalSequence,
    showModal: state.modal.showModal,
  },
  function EditDocketEntry({
    completeDocketEntryQCSequence,
    editDocketEntryHelper,
    formCancelToggleCancelSequence,
    openCompleteAndSendCaseMessageModalSequence,
    showModal,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          {editDocketEntryHelper.showPaperServiceWarning && (
            <Hint exclamation fullWidth>
              This document was automatically generated and requires paper
              service
            </Hint>
          )}
          <h2 className="heading-1">
            {editDocketEntryHelper.formattedDocument.documentTitle ||
              editDocketEntryHelper.formattedDocument.documentType}
          </h2>
          <div className="filed-by">
            <div className="padding-bottom-1">
              Filed {editDocketEntryHelper.formattedDocument.createdAtFormatted}
              {editDocketEntryHelper.formattedDocument.filedBy &&
                ` by ${editDocketEntryHelper.formattedDocument.filedBy}`}
            </div>
            {editDocketEntryHelper.formattedDocument.showServedAt && (
              <div>
                Served{' '}
                {editDocketEntryHelper.formattedDocument.servedAtFormatted}
              </div>
            )}
            {editDocketEntryHelper.formattedDocument.showLegacySealed && (
              <div>Sealed in Blackstone</div>
            )}
          </div>

          <SuccessNotification />
          <ErrorNotification />

          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <PrimaryDocumentForm />

                <div className="margin-top-5">
                  <Button
                    id="save-and-finish"
                    type="submit"
                    onClick={() => {
                      completeDocketEntryQCSequence();
                    }}
                  >
                    Complete
                  </Button>
                  <Button
                    secondary
                    id="save-and-add-supporting"
                    onClick={() => {
                      openCompleteAndSendCaseMessageModalSequence();
                    }}
                  >
                    Complete &amp; Send Message
                  </Button>
                  <Button
                    link
                    id="cancel-button"
                    onClick={() => {
                      formCancelToggleCancelSequence();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <div className="grid-col-7">
                <DocumentDisplayIframe />
              </div>
            </div>
          </div>
        </section>
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
        {showModal === 'CreateCaseMessageModalDialog' && (
          <CreateCaseMessageModalDialog
            title="Complete and Send Message"
            onConfirmSequence="completeDocketEntryQCAndSendMessageSequence"
          />
        )}
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={completeDocketEntryQCSequence}
          />
        )}
      </>
    );
  },
);
