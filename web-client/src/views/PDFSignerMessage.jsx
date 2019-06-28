import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PDFSignerMessage = connect(
  {
    constants: state.constants,
    form: state.form,
    pdfObj: state.pdfForSigning.pdfjsObj,
    setSignatureData: sequences.setPDFSignatureDataSequence,
    signatureData: state.pdfForSigning.signatureData,
    updateMessageValueSequence: sequences.updateMessageValueSequence,
    users: state.users,
    validateInitialWorkItemMessageSequence:
      sequences.validateInitialWorkItemMessageSequence,
    validationErrors: state.validationErrors,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({
    constants,
    form,
    updateMessageValueSequence,
    users,
    validateInitialWorkItemMessageSequence,
    validationErrors,
    workQueueSectionHelper,
  }) => {
    return (
      <div>
        <h3>Create Message</h3>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor="section">
            Select Section
          </label>

          <select
            className="usa-select"
            id="section"
            name="section"
            onChange={e => {
              updateMessageValueSequence({
                form: 'form',
                key: e.target.name,
                section: e.target.value,
                value: e.target.value,
              });
              validateInitialWorkItemMessageSequence();
            }}
          >
            <option value="">- Select -</option>
            {constants.SECTIONS.map(section => (
              <option key={section} value={section}>
                {workQueueSectionHelper.sectionDisplay(section)}
              </option>
            ))}
          </select>
        </div>

        <div
          className={
            'usa-form-group ' +
            (validationErrors.assigneeId ? 'usa-form-group--error' : '')
          }
        >
          <label className="usa-label" htmlFor="assigneeId">
            Select Recipient
          </label>
          <select
            aria-disabled={!form.section ? 'true' : 'false'}
            className="usa-select"
            disabled={!form.section}
            id="assigneeId"
            name="assigneeId"
            onChange={e => {
              updateMessageValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateInitialWorkItemMessageSequence();
            }}
          >
            <option value="">- Select -</option>
            {users.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
          {validationErrors.assigneeId && (
            <div className="usa-error-message beneath">
              {validationErrors.assigneeId}
            </div>
          )}
        </div>

        <div
          className={
            'usa-form-group ' +
            (validationErrors.message ? 'usa-form-group--error' : '')
          }
        >
          <label className="usa-label" htmlFor="message">
            Add Message
          </label>
          <textarea
            className="usa-textarea"
            id="message"
            name="message"
            onChange={e => {
              updateMessageValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateInitialWorkItemMessageSequence();
            }}
          />
          {validationErrors.message && (
            <div className="usa-error-message beneath">
              {validationErrors.message}
            </div>
          )}
        </div>
      </div>
    );
  },
);
