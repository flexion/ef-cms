import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const ConfirmEmailModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
  },
  function ConfirmEmailModal({ clearModalSequence }) {
    return (
      <ModalDialog
        className=""
        confirmLabel="Ok"
        confirmSequence={clearModalSequence}
        title="Please check your new email"
      >
        <p>
          You will use this email to log into the system and will receive future
          service at this email. Your previous email will no longer be valid.
        </p>
      </ModalDialog>
    );
  },
);
