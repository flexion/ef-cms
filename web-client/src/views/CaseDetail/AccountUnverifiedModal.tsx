import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AccountUnverifiedModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence:
      sequences.submitUpdatePetitionerInformationFromModalSequence,
  },
  // TODO: Workshop message with UXs
  function AccountUnverifiedModal({ cancelSequence }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        confirmLabel="OK"
        confirmSequence={cancelSequence}
        title="Account is Unverified"
      >
        <div>
          <p>
            This account is unverified. The account will be updated to pending
            status.
          </p>
        </div>
      </ModalDialog>
    );
  },
);

AccountUnverifiedModal.displayName = 'AccountUnverifiedModal';
