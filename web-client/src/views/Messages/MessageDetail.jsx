import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CompleteCaseMessageModalDialog } from './CompleteCaseMessageModalDialog';
import { ErrorNotification } from '../ErrorNotification';
import { ForwardCaseMessageModalDialog } from './ForwardCaseMessageModalDialog';
import { ReplyToCaseMessageModalDialog } from './ReplyToCaseMessageModalDialog';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const SingleMessage = ({ indent, message }) => (
  <>
    <div className={classNames('grid-row', indent && 'padding-left-5')}>
      <div className="grid-col-2">
        <span className="text-semibold margin-right-1">Received</span>{' '}
        {message.createdAtFormatted}
      </div>
      <div className="grid-col-2">
        <span className="text-semibold margin-right-1">From</span>{' '}
        {message.from}
      </div>
      <div className="grid-col-2">
        <span className="text-semibold margin-right-1">To</span> {message.to}
      </div>
      <div className="grid-col-5">
        <span className="text-semibold margin-right-1">Subject</span>{' '}
        {message.subject}
      </div>
    </div>
    <div
      className={classNames(
        'grid-row margin-top-2',
        indent && 'padding-left-5',
      )}
    >
      <span className="text-semibold margin-right-1">Message</span>{' '}
      {message.message}
    </div>
  </>
);

const CompletedMessage = ({ message }) => (
  <>
    <div className="grid-row">
      <div className="grid-col-2">
        <span className="text-semibold margin-right-1">Completed</span>{' '}
        {message.completedAtFormatted}
      </div>
      <div className="grid-col-3">
        <span className="text-semibold margin-right-1">Completed by</span>{' '}
        {message.completedBy}
      </div>
    </div>
    <div className="grid-row margin-top-2">
      <span className="text-semibold margin-right-1">Comment</span>{' '}
      {message.completedMessage || 'There is no comment'}
    </div>
  </>
);

export const MessageDetail = connect(
  {
    attachmentDocumentToDisplay: state.attachmentDocumentToDisplay,
    cerebralBindSimpleSetStateSequence:
      sequences.cerebralBindSimpleSetStateSequence,
    formattedMessageDetail: state.formattedMessageDetail,
    iframeSrc: state.iframeSrc,
    isExpanded: state.isExpanded,
    openCompleteMessageModalSequence:
      sequences.openCompleteMessageModalSequence,
    openForwardMessageModalSequence: sequences.openForwardMessageModalSequence,
    openReplyToMessageModalSequence: sequences.openReplyToMessageModalSequence,
    setAttachmentDocumentToDisplaySequence:
      sequences.setAttachmentDocumentToDisplaySequence,
    showModal: state.modal.showModal,
  },
  function MessageDetail({
    attachmentDocumentToDisplay,
    cerebralBindSimpleSetStateSequence,
    formattedMessageDetail,
    iframeSrc,
    isExpanded,
    openCompleteMessageModalSequence,
    openForwardMessageModalSequence,
    openReplyToMessageModalSequence,
    setAttachmentDocumentToDisplaySequence,
    showModal,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container message-detail">
          <SuccessNotification />
          <ErrorNotification />
          {formattedMessageDetail.isCompleted && (
            <div
              aria-live="polite"
              className="usa-alert usa-alert--warning"
              role="alert"
            >
              <div className="usa-alert__body">
                Message completed on{' '}
                {formattedMessageDetail.currentMessage.completedAtFormatted} by{' '}
                {formattedMessageDetail.currentMessage.completedBy}
              </div>
            </div>
          )}
          <div className="grid-row grid-gap">
            <div className="grid-col-8">
              <h1>Message</h1>
            </div>
            {formattedMessageDetail.showActionButtons && (
              <>
                <div className="grid-col-1">
                  <Button
                    link
                    className="action-button"
                    icon="check-circle"
                    id="button-complete"
                    onClick={() => openCompleteMessageModalSequence()}
                  >
                    Complete
                  </Button>
                </div>
                <div className="grid-col-1">
                  <Button
                    link
                    className="action-button"
                    icon="share-square"
                    id="button-forward"
                    onClick={() => openForwardMessageModalSequence()}
                  >
                    Forward
                  </Button>
                </div>
                <div className="grid-col-1">
                  <Button
                    link
                    className="action-button"
                    icon="reply"
                    id="button-reply"
                    onClick={() => openReplyToMessageModalSequence()}
                  >
                    Reply
                  </Button>
                </div>
              </>
            )}
          </div>

          {formattedMessageDetail.hasOlderMessages ? (
            <div className="usa-accordion__heading">
              <button
                aria-expanded={isExpanded}
                className="usa-accordion__button grid-container"
                id="ustc-ui-accordion-item-button-0"
                type="button"
                onClick={() =>
                  cerebralBindSimpleSetStateSequence({
                    key: 'isExpanded',
                    value: !isExpanded,
                  })
                }
              >
                <div className="accordion-item-title padding-left-1">
                  {formattedMessageDetail.isCompleted ? (
                    <CompletedMessage
                      message={formattedMessageDetail.currentMessage}
                    />
                  ) : (
                    <SingleMessage
                      message={formattedMessageDetail.currentMessage}
                    />
                  )}
                </div>
              </button>
            </div>
          ) : (
            <div className="bg-base-lightest padding-top-2 padding-bottom-2 padding-left-3 padding-right-3">
              <SingleMessage message={formattedMessageDetail.currentMessage} />
            </div>
          )}

          {formattedMessageDetail.showOlderMessages &&
            formattedMessageDetail.olderMessages.map((message, idx) => (
              <div
                className="border border-base-lightest padding-top-2 padding-bottom-2 padding-left-3 padding-right-3"
                key={idx}
              >
                <SingleMessage indent={true} message={message} />
              </div>
            ))}

          <h2 className="margin-top-5">Attachments</h2>

          <div className="grid-row grid-gap-5">
            <div className="grid-col-4">
              <div className="border border-base-lighter message-detail--attachments">
                {!formattedMessageDetail.attachments.length && (
                  <div className="padding-2">There are no attachments</div>
                )}

                {formattedMessageDetail.attachments.length > 0 &&
                  formattedMessageDetail.attachments.map(attachment => {
                    const active =
                      attachmentDocumentToDisplay === attachment
                        ? 'active'
                        : '';
                    return (
                      <Button
                        className={`usa-button--unstyled attachment-viewer-button ${active}`}
                        key={attachment.documentId}
                        onClick={() => {
                          setAttachmentDocumentToDisplaySequence({
                            attachmentDocumentToDisplay: attachment,
                          });
                        }}
                      >
                        {attachment.documentTitle}
                      </Button>
                    );
                  })}
              </div>
            </div>

            <div className="grid-col-8">
              <div className="border border-base-lighter message-detail--attachments">
                {!attachmentDocumentToDisplay && (
                  <div className="padding-2">
                    There are no attachments to preview
                  </div>
                )}

                {!process.env.CI && attachmentDocumentToDisplay && (
                  <iframe
                    src={iframeSrc}
                    title={attachmentDocumentToDisplay.documentTitle}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        {showModal === 'CompleteMessageModal' && (
          <CompleteCaseMessageModalDialog />
        )}
        {showModal === 'ForwardMessageModal' && (
          <ForwardCaseMessageModalDialog />
        )}
        {showModal === 'ReplyToMessageModal' && (
          <ReplyToCaseMessageModalDialog />
        )}
      </>
    );
  },
);
