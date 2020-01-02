import { Button } from '../../ustc-ui/Button/Button';

import { CaseDetailHeader } from './CaseDetailHeader';
import { PetitionPaymentForm } from './PetitionPaymentForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionDetails = connect(
  {
    docketNumber: state.caseDetail.docketNumber,
    updatePetitionFeePaymentSequence:
      sequences.updatePetitionFeePaymentSequence,
  },
  ({ docketNumber, updatePetitionFeePaymentSequence }) => {
    return (
      <>
        <CaseDetailHeader />

        <section
          className="usa-section grid-container"
          id="case-detail-internal"
        >
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

          <Button link href={`/case-detail/${docketNumber}`}>
            Cancel
          </Button>
        </section>
      </>
    );
  },
);
