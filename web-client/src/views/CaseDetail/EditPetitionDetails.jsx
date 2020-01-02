import { Button } from '../../ustc-ui/Button/Button';

import { PetitionPaymentForm } from './PetitionPaymentForm';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const EditPetitionDetails = connect(
  {
    cancelEditPetitionDetailsSequence:
      sequences.cancelEditPetitionDetailsSequence,
    updatePetitionFeePaymentSequence:
      sequences.updatePetitionFeePaymentSequence,
  },
  ({ cancelEditPetitionDetailsSequence, updatePetitionFeePaymentSequence }) => {
    return (
      <>
        <h1>Edit Petition Details</h1>
        <div className="blue-container margin-bottom-4">
          <h3 className="margin-bottom-2">Petition Fee</h3>
          <PetitionPaymentForm />
        </div>

        <Button
          onClick={() => {
            updatePetitionFeePaymentSequence();
          }}
        >
          Save
        </Button>

        <Button link onClick={() => cancelEditPetitionDetailsSequence()}>
          Cancel
        </Button>
      </>
    );
  },
);
