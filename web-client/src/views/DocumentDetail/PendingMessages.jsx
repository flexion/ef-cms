import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PendingMessages = connect(
  {
    constants: state.constants,
    documentDetailHelper: state.documentDetailHelper,
    form: state.form,
    messageId: state.messageId,
    openCreateMessageModalSequence: sequences.openCreateMessageModalSequence,
    setWorkItemActionSequence: sequences.setWorkItemActionSequence,
    submitCompleteSequence: sequences.submitCompleteSequence,
    submitForwardSequence: sequences.submitForwardSequence,
    updateCompleteFormValueSequence: sequences.updateCompleteFormValueSequence,
    updateForwardFormValueSequence: sequences.updateForwardFormValueSequence,
    users: state.users,
    validateForwardMessageSequence: sequences.validateForwardMessageSequence,
    validationErrors: state.validationErrors,
    workItemMetadata: state.workItemMetadata,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({
    constants,
    documentDetailHelper,
    form,
    messageId,
    openCreateMessageModalSequence,
    setWorkItemActionSequence,
    submitCompleteSequence,
    submitForwardSequence,
    updateCompleteFormValueSequence,
    updateForwardFormValueSequence,
    users,
    validateForwardMessageSequence,
    validationErrors,
    workItemMetadata,
    workQueueSectionHelper,
  }) => {
    return (
      <>
        <button
          type="button"
          id="create-message-button"
          onClick={() => openCreateMessageModalSequence()}
          className="usa-button-secondary"
        >
          Create Message
        </button>

        {(!documentDetailHelper.formattedDocument ||
          !documentDetailHelper.formattedDocument.workItems ||
          !documentDetailHelper.formattedDocument.workItems.length) && (
          <div>
            There are no pending messages associated with this document.
          </div>
        )}
        {documentDetailHelper.formattedDocument &&
          documentDetailHelper.formattedDocument.workItems &&
          documentDetailHelper.formattedDocument.workItems.map(
            (workItem, idx) => (
              <div
                className={`card ${
                  workItem.currentMessage.messageId === messageId
                    ? 'highlight'
                    : ''
                }`}
                aria-labelledby="tab-pending-messages"
                key={idx}
              >
                <div className="content-wrapper">
                  <p>
                    <span className="label-inline">To</span>
                    {workItem.currentMessage.to}
                  </p>
                  <p>
                    <span className="label-inline">From</span>
                    {workItem.currentMessage.from}
                  </p>
                  <p>
                    <span className="label-inline">Received</span>
                    {workItem.currentMessage.createdAtTimeFormatted}
                  </p>
                  <p>{workItem.currentMessage.message}</p>
                </div>
                <div
                  className="content-wrapper toggle-button-wrapper actions-wrapper"
                  role="tablist"
                >
                  <button
                    role="tab"
                    id={`history-tab-${idx}`}
                    aria-selected={documentDetailHelper.showAction(
                      'history',
                      workItem.workItemId,
                    )}
                    aria-controls={`history-card-${idx}`}
                    className={`${
                      documentDetailHelper.showAction(
                        'history',
                        workItem.workItemId,
                      )
                        ? 'selected'
                        : 'unselected'
                    }`}
                    onClick={() =>
                      setWorkItemActionSequence({
                        action: 'history',
                        workItemId: workItem.workItemId,
                      })
                    }
                  >
                    <FontAwesomeIcon icon="list-ul" size="sm" />
                    View History
                  </button>
                  {workItem.showComplete && (
                    <button
                      role="tab"
                      id={`complete-tab-${idx}`}
                      aria-selected={documentDetailHelper.showAction(
                        'complete',
                        workItem.workItemId,
                      )}
                      aria-controls={`history-card-${idx}`}
                      className={`${
                        documentDetailHelper.showAction(
                          'complete',
                          workItem.workItemId,
                        )
                          ? 'selected'
                          : 'unselected'
                      }`}
                      onClick={() =>
                        setWorkItemActionSequence({
                          action: 'complete',
                          workItemId: workItem.workItemId,
                        })
                      }
                    >
                      <FontAwesomeIcon
                        icon={['far', 'check-circle']}
                        size="sm"
                      />
                      Complete
                    </button>
                  )}
                  {workItem.showSendTo && (
                    <button
                      role="tab"
                      id={`forward-tab-${idx}`}
                      aria-selected={documentDetailHelper.showAction(
                        'forward',
                        workItem.workItemId,
                      )}
                      aria-controls={`forward-card-${idx}`}
                      data-workitemid={workItem.workItemId}
                      className={`send-to ${
                        documentDetailHelper.showAction(
                          'forward',
                          workItem.workItemId,
                        )
                          ? 'selected'
                          : 'unselected'
                      }`}
                      onClick={() =>
                        setWorkItemActionSequence({
                          action: 'forward',
                          workItemId: workItem.workItemId,
                        })
                      }
                    >
                      <FontAwesomeIcon icon="share-square" size="sm" /> Send To
                    </button>
                  )}
                </div>
                {documentDetailHelper.showAction(
                  'complete',
                  workItem.workItemId,
                ) && (
                  <div
                    id={`complete-card-${idx}`}
                    role="tabpanel"
                    aria-labelledby={`complete-tab-${idx}`}
                    className="content-wrapper actions-wrapper"
                  >
                    <form
                      id={`complete-form-${idx}`}
                      role="form"
                      noValidate
                      onSubmit={e => {
                        e.preventDefault();
                        submitCompleteSequence({
                          workItemId: workItem.workItemId,
                        });
                        setWorkItemActionSequence({
                          action: null,
                          workItemId: workItem.workItemId,
                        });
                      }}
                    >
                      <label htmlFor={`complete-message-${idx}`}>
                        Add Message (optional)
                      </label>
                      <textarea
                        name="completeMessage"
                        id={`complete-message-${idx}`}
                        onChange={e => {
                          updateCompleteFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                            workItemId: workItem.workItemId,
                          });
                        }}
                      />
                      <button type="submit" className="usa-button">
                        <span>Complete</span>
                      </button>
                    </form>
                  </div>
                )}
                {documentDetailHelper.showAction(
                  'history',
                  workItem.workItemId,
                ) &&
                  !workItem.historyMessages.length && (
                    <div
                      id={`history-card-${idx}`}
                      className="content-wrapper"
                      role="tabpanel"
                      aria-labelledby={`history-tab-${idx}`}
                    >
                      No additional messages are available.
                    </div>
                  )}
                {documentDetailHelper.showAction(
                  'history',
                  workItem.workItemId,
                ) &&
                  workItem.historyMessages.length > 0 && (
                    <div
                      className="content-wrapper actions-wrapper"
                      id={`history-card-${idx}`}
                      role="tabpanel"
                      aria-labelledby={`history-tab-${idx}`}
                    >
                      {workItem.historyMessages.map((message, mIdx) => (
                        <div key={mIdx}>
                          <p>
                            <span className="label-inline">To</span>
                            {message.to}
                          </p>
                          <p>
                            <span className="label-inline">From</span>
                            {message.from}
                          </p>
                          <p>
                            <span className="label-inline">Received</span>
                            {message.createdAtTimeFormatted}
                          </p>
                          <p>{message.message}</p>
                          {workItem.historyMessages.length - 1 !== mIdx && (
                            <hr aria-hidden="true" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                {documentDetailHelper.showAction(
                  'forward',
                  workItem.workItemId,
                ) && (
                  <div
                    id={`forward-card-${idx}`}
                    role="tabpanel"
                    className="content-wrapper actions-wrapper"
                  >
                    <form
                      aria-labelledby={`forward-tab-${idx}`}
                      data-workitemid={workItem.workItemId}
                      className="forward-form"
                      role="form"
                      noValidate
                      onSubmit={e => {
                        e.preventDefault();
                        submitForwardSequence({
                          workItemId: workItem.workItemId,
                        });
                      }}
                    >
                      <div
                        className={
                          'usa-form-group ' +
                          (validationErrors[workItem.workItemId] &&
                          validationErrors[workItem.workItemId].section &&
                          !workItemMetadata.showChambersSelect
                            ? 'usa-input-error'
                            : '')
                        }
                      >
                        <label htmlFor={`section-${idx}`}>Select Section</label>

                        <select
                          className="usa-input-inline"
                          id={`section-${idx}`}
                          name="section"
                          onChange={e => {
                            updateForwardFormValueSequence({
                              form: `form.${workItem.workItemId}`,
                              key: e.target.name,
                              section: e.target.value,
                              value: e.target.value,
                              workItemId: workItem.workItemId,
                            });
                            validateForwardMessageSequence({
                              workItemId: workItem.workItemId,
                            });
                          }}
                        >
                          <option value="">- Select -</option>
                          {constants.SECTIONS.map(section => (
                            <option key={section} value={section}>
                              {workQueueSectionHelper.sectionDisplay(section)}
                            </option>
                          ))}
                        </select>
                        {!workItemMetadata.showChambersSelect && (
                          <div className="usa-input-error-message beneath">
                            {validationErrors[workItem.workItemId] &&
                              validationErrors[workItem.workItemId].section}
                          </div>
                        )}
                      </div>

                      {workItemMetadata.showChambersSelect && (
                        <div
                          className={
                            'usa-form-group ' +
                            (validationErrors[workItem.workItemId] &&
                            validationErrors[workItem.workItemId].section
                              ? 'usa-input-error'
                              : '')
                          }
                        >
                          <label htmlFor={`chambers-${idx}`}>
                            Select Chambers
                          </label>

                          <select
                            className="usa-input-inline"
                            id={`chambers-${idx}`}
                            name="chambers"
                            onChange={e => {
                              updateForwardFormValueSequence({
                                form: `form.${workItem.workItemId}`,
                                key: e.target.name,
                                section: e.target.value,
                                value: e.target.value,
                                workItemId: workItem.workItemId,
                              });
                              validateForwardMessageSequence({
                                workItemId: workItem.workItemId,
                              });
                            }}
                          >
                            <option value="">- Select -</option>
                            {constants.CHAMBERS_SECTIONS.map(section => (
                              <option key={section} value={section}>
                                {workQueueSectionHelper.chambersDisplay(
                                  section,
                                )}
                              </option>
                            ))}
                          </select>

                          {validationErrors[workItem.workItemId] &&
                            validationErrors[workItem.workItemId].section && (
                              <div className="usa-input-error-message beneath">
                                Chambers is required.
                              </div>
                            )}
                        </div>
                      )}

                      <div
                        className={
                          'usa-form-group ' +
                          (validationErrors[workItem.workItemId] &&
                          validationErrors[workItem.workItemId].assigneeId
                            ? 'usa-input-error'
                            : '')
                        }
                      >
                        <label htmlFor={`assignee-id-${idx}`}>
                          Select Recipient
                        </label>
                        <select
                          className="usa-input-inline"
                          id={`assignee-id-${idx}`}
                          name="assigneeId"
                          disabled={
                            !form[workItem.workItemId] ||
                            !form[workItem.workItemId].section
                          }
                          aria-disabled={
                            !form[workItem.workItemId] ||
                            !form[workItem.workItemId].section
                              ? 'true'
                              : 'false'
                          }
                          onChange={e => {
                            updateForwardFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                              workItemId: workItem.workItemId,
                            });
                            validateForwardMessageSequence({
                              workItemId: workItem.workItemId,
                            });
                          }}
                        >
                          <option value="">- Select -</option>
                          {users.map(user => (
                            <option key={user.userId} value={user.userId}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                        <div className="usa-input-error-message beneath">
                          {validationErrors[workItem.workItemId] &&
                            validationErrors[workItem.workItemId].assigneeId}
                        </div>
                      </div>

                      <div
                        className={
                          'usa-form-group ' +
                          (validationErrors[workItem.workItemId] &&
                          validationErrors[workItem.workItemId].forwardMessage
                            ? 'usa-input-error'
                            : '')
                        }
                      >
                        <label htmlFor={`forward-message-${idx}`}>
                          Add Message
                        </label>
                        <textarea
                          aria-labelledby={`message-label-${idx}`}
                          name="forwardMessage"
                          id={`forward-message-${idx}`}
                          onChange={e => {
                            updateForwardFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                              workItemId: workItem.workItemId,
                            });
                            validateForwardMessageSequence({
                              workItemId: workItem.workItemId,
                            });
                          }}
                        />{' '}
                        <div className="usa-input-error-message beneath">
                          {validationErrors[workItem.workItemId] &&
                            validationErrors[workItem.workItemId]
                              .forwardMessage}
                        </div>
                      </div>

                      <button type="submit" className="usa-button">
                        Send
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ),
          )}
      </>
    );
  },
);
