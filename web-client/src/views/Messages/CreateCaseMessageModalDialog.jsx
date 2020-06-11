import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreateCaseMessageModalDialog = connect(
  {
    constants: state.constants,
    createCaseMessageModalHelper: state.createCaseMessageModalHelper,
    form: state.modal.form,
    showChambersSelect: state.modal.showChambersSelect,
    updateCreateCaseMessageValueInModalSequence:
      sequences.updateCreateCaseMessageValueInModalSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    users: state.users,
    validateCreateCaseMessageInModalSequence:
      sequences.validateCreateCaseMessageInModalSequence,
    validationErrors: state.validationErrors,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  function CreateMessageModalDialog({
    constants,
    createCaseMessageModalHelper,
    form,
    onConfirmSequence = 'createCaseMessageSequence',
    showChambersSelect,
    updateCreateCaseMessageValueInModalSequence,
    updateScreenMetadataSequence,
    users,
    validateCreateCaseMessageInModalSequence,
    validationErrors,
    workQueueSectionHelper,
  }) {
    validationErrors = validationErrors || {};
    form = form || {};

    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="ustc-create-message-modal"
        confirmLabel="Send"
        preventCancelOnBlur={true}
        title="Create Message"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence={onConfirmSequence}
      >
        <FormGroup
          errorText={!showChambersSelect && validationErrors.toSection}
        >
          <label className="usa-label" htmlFor="toSection">
            Select a section
          </label>

          <select
            className="usa-select"
            id="toSection"
            name="toSection"
            onChange={async e => {
              await updateCreateCaseMessageValueInModalSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          >
            <option value="">- Select -</option>
            {constants.SECTIONS.map(section => (
              <option key={section} value={section}>
                {workQueueSectionHelper.sectionDisplay(section)}
              </option>
            ))}
          </select>
        </FormGroup>

        {showChambersSelect && (
          <FormGroup
            errorText={validationErrors.toSection && 'Select a chamber'}
          >
            <label className="usa-label" htmlFor="chambers">
              Select chambers
            </label>
            <select
              className="usa-select"
              id="chambers"
              name="chambers"
              onChange={e => {
                updateCreateCaseMessageValueInModalSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateCreateCaseMessageInModalSequence();
              }}
            >
              <option value="">- Select -</option>
              {constants.CHAMBERS_SECTIONS.map(section => (
                <option key={section} value={section}>
                  {workQueueSectionHelper.chambersDisplay(section)}
                </option>
              ))}
            </select>
          </FormGroup>
        )}

        <FormGroup errorText={validationErrors.toUserId}>
          <label className="usa-label" htmlFor="toUserId">
            Select recipient
          </label>
          <select
            aria-disabled={!form.toSection ? 'true' : 'false'}
            className="usa-select"
            disabled={!form.toSection}
            id="toUserId"
            name="toUserId"
            onChange={e => {
              updateCreateCaseMessageValueInModalSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          >
            <option value="">- Select -</option>
            {users.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup errorText={validationErrors.subject}>
          <label className="usa-label" htmlFor="subject">
            Subject line
          </label>
          <input
            className="usa-input"
            id="subject"
            name="subject"
            type="text"
            onChange={e => {
              updateCreateCaseMessageValueInModalSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          />
        </FormGroup>

        <FormGroup errorText={validationErrors.message}>
          <label className="usa-label" htmlFor="message">
            Add message
          </label>
          <textarea
            className="usa-textarea"
            id="message"
            name="message"
            onChange={e => {
              updateCreateCaseMessageValueInModalSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          />
        </FormGroup>

        {createCaseMessageModalHelper.showAddDocumentForm && (
          <FormGroup>
            <label className="usa-label" htmlFor="document">
              Add document(s) <span className="usa-hint">(optional)</span>
            </label>
            <select className="usa-select" id="document" name="document">
              <option value="">- Select -</option>
            </select>
          </FormGroup>
        )}

        {createCaseMessageModalHelper.showAddMoreDocumentsButton && (
          <Button
            link
            icon="plus-circle"
            iconColor="blue"
            onClick={() => {
              updateScreenMetadataSequence({
                key: 'showAddDocumentForm',
                value: true,
              });
            }}
          >
            Add More Document(s)
          </Button>
        )}
      </ConfirmModal>
    );
  },
);
