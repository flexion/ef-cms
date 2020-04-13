import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { PractitionerForm } from './PractitionerForm';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPractitionerUser = connect(
  {
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    submitUpdatePractitionerUserSequence:
      sequences.submitUpdatePractitionerUserSequence,
  },
  function EditPractitionerUser({
    form,
    navigateBackSequence,
    submitUpdatePractitionerUserSequence,
  }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-12">
                <h1 className="captioned" tabIndex="-1">
                  {form.name}
                </h1>
                <span className="usa-tag">Active</span>
              </div>
            </div>
            <div className="grid-row">
              <div className="tablet:grid-col-12">{form.barNumber}</div>
            </div>
          </div>
        </div>

        <section className="grid-container">
          <h1 className="margin-bottom-1">Edit Practitioner Details</h1>
          <SuccessNotification />
          <ErrorNotification />

          <PractitionerForm />

          <div className="grid-row margin-bottom-6">
            <div className="grid-col-12">
              <Button
                onClick={() => {
                  submitUpdatePractitionerUserSequence();
                }}
              >
                Save Updates
              </Button>
              <Button link onClick={() => navigateBackSequence()}>
                Cancel
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  },
);
