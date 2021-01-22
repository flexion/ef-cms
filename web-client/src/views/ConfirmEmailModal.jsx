import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ConfirmEmailModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    form: state.form,
    submitUpdateUserContactInformationSequence:
      sequences.submitUpdateUserContactInformationSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function ConfirmEmailModal({
    clearModalSequence,
    form,
    submitUpdateUserContactInformationSequence,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={clearModalSequence}
        className=""
        confirmLabel="Continue"
        confirmSequence={submitUpdateUserContactInformationSequence}
        title="Confirm Your Email Update"
      >
        <p>
          You will use this email to log into the system and will receive future
          service at this email. Your previous email will no longer be valid.
        </p>

        <FormGroup errorText={validationErrors.confirmEmail}>
          <label className="usa-label" htmlFor="confirm-email">
            Re-enter email address
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            id="confirm-email"
            name="confirmEmail"
            type="text"
            value={form.confirmEmail || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      </ModalDialog>
    );
  },
);
