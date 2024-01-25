import { Button } from '../../ustc-ui/Button/Button';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const RequestAccessReview = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
    requestAccessHelper: state.requestAccessHelper,
    showModal: state.modal.showModal,
    submitCaseAssociationRequestSequence:
      sequences.submitCaseAssociationRequestSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function RequestAccessReview({
    fileDocumentHelper,
    form,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    pdfPreviewUrl,
    requestAccessHelper,
    showModal,
    submitCaseAssociationRequestSequence,
    updateFormValueSequence,
  }) {
    return (
      <React.Fragment>
        <Focus>
          <h1
            className="heading-1 margin-bottom-0"
            id="file-a-document-header"
            tabIndex={-1}
          >
            Review Your Filing
          </h1>
        </Focus>

        <p className="full-width">
          You can’t edit your filing once you submit it. Please make sure your
          information appears the way you want it to.
        </p>
        <div className="grid-row grid-gap">
          <div className="grid-col">
            <WarningNotificationComponent
              alertWarning={{
                message:
                  "Don't forget to check your document(s) to ensure personal information has been removed or redacted.",
              }}
              dismissable={false}
              scrollToTop={false}
            />

            <div className="grid-container padding-x-0">
              <div className="grid-row grid-gap">
                <div
                  className={classNames('margin-bottom-4', {
                    'grid-col-12':
                      requestAccessHelper.isAutoGeneratedEntryOfAppearance,
                    'tablet:grid-col-7':
                      !requestAccessHelper.isAutoGeneratedEntryOfAppearance,
                  })}
                >
                  <div className="card height-full margin-bottom-0">
                    <div className="content-wrapper">
                      <h3 className="underlined">Your Document(s)</h3>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col margin-bottom-1">
                          <div className="tablet:margin-bottom-0 margin-bottom-205">
                            <label
                              className="usa-label"
                              htmlFor="primary-filing"
                            >
                              {form.documentTitle}
                            </label>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                {!requestAccessHelper.isAutoGeneratedEntryOfAppearance ? (
                                  <PDFPreviewButton
                                    file={form.primaryDocumentFile}
                                    title={form.documentTitle}
                                  />
                                ) : (
                                  <a
                                    href={pdfPreviewUrl}
                                    rel="noreferrer"
                                    target="_blank"
                                  >
                                    <FontAwesomeIcon
                                      className="fa-icon-blue"
                                      icon={['fas', 'file-pdf']}
                                    />{' '}
                                    {form.documentTitle}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {!requestAccessHelper.isAutoGeneratedEntryOfAppearance && (
                          <div className="tablet:grid-col margin-bottom-1">
                            {requestAccessHelper.showFilingIncludes && (
                              <div
                                className={classNames(
                                  !requestAccessHelper.documentWithObjections
                                    ? 'margin-bottom-0'
                                    : 'margin-bottom-5',
                                )}
                              >
                                <label
                                  className="usa-label"
                                  htmlFor="filing-includes"
                                >
                                  Document includes
                                </label>
                                <ul className="ustc-unstyled-list without-margins">
                                  {form.certificateOfService && (
                                    <li>
                                      Certificate of Service{' '}
                                      {
                                        requestAccessHelper.certificateOfServiceDateFormatted
                                      }
                                    </li>
                                  )}
                                  {form.attachments && <li>Attachment(s)</li>}
                                </ul>
                              </div>
                            )}
                            {requestAccessHelper.documentWithObjections && (
                              <div className="margin-bottom-0">
                                <label
                                  className="usa-label"
                                  htmlFor="objections"
                                >
                                  Objections?
                                </label>
                                {form.objections}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {form.supportingDocuments &&
                        form.supportingDocuments.map((item, idx) => (
                          <React.Fragment key={item.documentTitle}>
                            <div className="grid-row grid-gap overline padding-top-105 margin-top-105">
                              <div className="tablet:grid-col-6 margin-bottom-1">
                                <div className="tablet:margin-bottom-0 margin-bottom-205">
                                  <h3 className="usa-label">
                                    {item.documentTitle}
                                  </h3>
                                  <div className="grid-row">
                                    <div className="grid-col flex-auto">
                                      {!requestAccessHelper.isAutoGeneratedEntryOfAppearance ? (
                                        <PDFPreviewButton
                                          file={form.primaryDocumentFile}
                                          title={form.documentTitle}
                                        />
                                      ) : (
                                        <a
                                          href={pdfPreviewUrl}
                                          rel="noreferrer"
                                          target="_blank"
                                        >
                                          <FontAwesomeIcon
                                            className="fa-icon-blue"
                                            icon={['fas', 'file-pdf']}
                                          />{' '}
                                          {form.documentTitle}
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="tablet:grid-col-6 margin-bottom-1">
                                {fileDocumentHelper.supportingDocuments[idx]
                                  .showFilingIncludes && (
                                  <div className="margin-bottom-0">
                                    <label
                                      className="usa-label"
                                      htmlFor="filing-includes"
                                    >
                                      Document includes
                                    </label>
                                    <ul className="ustc-unstyled-list without-margins">
                                      {item.certificateOfService && (
                                        <li>
                                          Certificate of Service{' '}
                                          {
                                            fileDocumentHelper
                                              .supportingDocuments[idx]
                                              .certificateOfServiceDateFormatted
                                          }
                                        </li>
                                      )}
                                      {item.attachments && (
                                        <li>Attachment(s)</li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </React.Fragment>
                        ))}
                    </div>
                  </div>
                </div>

                {requestAccessHelper.showPartiesRepresenting && (
                  <div
                    className={classNames('margin-bottom-4', {
                      'grid-col-12':
                        requestAccessHelper.isAutoGeneratedEntryOfAppearance,
                      'tablet:grid-col-5':
                        !requestAccessHelper.isAutoGeneratedEntryOfAppearance,
                    })}
                  >
                    <div className="card height-full margin-bottom-0">
                      <div className="content-wrapper">
                        <h3 className="underlined">
                          Parties You’re Representing
                        </h3>
                        <div className="grid-row grid-gap">
                          <div className="tablet:grid-col-6 margin-bottom-1">
                            <h3 className="usa-label">Parties</h3>
                            <ul className="ustc-unstyled-list without-margins">
                              {requestAccessHelper.representingPartiesNames.map(
                                name => (
                                  <li key={name}>{name}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid-row grid-gap margin-bottom-5">
              <div className="tablet:grid-col-12 bg-white submit-reminders">
                <div className="card">
                  <div className="content-header bg-accent-cool-dark text-white heading-3">
                    A Few Reminders Before You Submit
                  </div>
                  <div className="content-wrapper">
                    <ol className="numbered-list">
                      <li>
                        Double check that the PDF files you’ve selected are
                        correct.
                      </li>
                      <li>
                        Be sure you’ve removed or redacted all personal
                        information from your documents.
                      </li>
                      <li>
                        Indicate any related documents that you’ve included with
                        your filing.
                      </li>
                      <li>
                        Confirm everything appears as you want it to—you can’t
                        edit your filing after you submit it.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {fileDocumentHelper.EARedactionAcknowledgement && (
            <div className="grid-row grid-gap">
              <span className="margin-bottom-1 font-sans-pro">
                <b>Please read and acknowledge before submitting your filing</b>
              </span>
              <div className="tablet:grid-col-12">
                <div className="card">
                  <div className="content-wrapper usa-checkbox">
                    <input
                      aria-describedby="redaction-acknowledgement-label"
                      checked={form.redactionAcknowledgement || false}
                      className="usa-checkbox__input"
                      id="redaction-acknowledgement"
                      name="redactionAcknowledgement"
                      type="checkbox"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                      }}
                    />
                    <label
                      className="usa-checkbox__label"
                      data-testid="redaction-acknowledgement-label"
                      htmlFor="redaction-acknowledgement"
                      id="redaction-acknowledgement-label"
                    >
                      <b>
                        All documents I am filing have been redacted in
                        accordance with{' '}
                        <a
                          href="https://ustaxcourt.gov/resources/ropp/Rule-27_Amended_03202023.pdf"
                          rel="noreferrer"
                          target="_blank"
                        >
                          Rule 27
                        </a>
                        .
                      </b>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="margin-top-2">
            <Button
              className="margin-bottom-1"
              data-testid="request-access-review-submit-document"
              disabled={
                fileDocumentHelper.EARedactionAcknowledgement &&
                !form.redactionAcknowledgement
              }
              id="submit-document"
              type="submit"
              onClick={() => {
                submitCaseAssociationRequestSequence();
              }}
            >
              Submit Your Filing
            </Button>
            <Button secondary onClick={() => navigateBackSequence()}>
              Back
            </Button>
            <Button
              link
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </Button>
          </div>

          {requestAccessHelper.isAutoGeneratedEntryOfAppearance && (
            <NonMobile>
              <div
                className="grid-col padding-top-1"
                data-testid="entry-of-appearance-pdf-preview"
              >
                <PdfPreview heightOverride={true} />
              </div>
            </NonMobile>
          )}
        </div>

        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={submitCaseAssociationRequestSequence}
          />
        )}
      </React.Fragment>
    );
  },
);

RequestAccessReview.displayName = 'RequestAccessReview';
