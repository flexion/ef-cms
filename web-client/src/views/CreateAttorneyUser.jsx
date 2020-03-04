import { Button } from '../ustc-ui/Button/Button';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { Select } from '../ustc-ui/Select/Select';
import { UserContactEditForm } from './UserContactEditForm';
import { capitalize } from 'lodash';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreateAttorneyUser = connect(
  {
    createAttorneyUserHelper: state.createAttorneyUserHelper,
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    submitCreateAttorneyUserSequence:
      sequences.submitCreateAttorneyUserSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateAttorneyUserSequence: sequences.validateAttorneyUserSequence,
    validationErrors: state.validationErrors,
  },
  ({
    createAttorneyUserHelper,
    form,
    navigateBackSequence,
    submitCreateAttorneyUserSequence,
    updateFormValueSequence,
    validateAttorneyUserSequence,
    validationErrors,
  }) => {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Create Attorney User</h1>
          </div>
        </div>

        <div className="grid-container">
          <div className="grid-row">
            <div className="grid-col-12">
              <FormGroup errorText={validationErrors.name}>
                <label className="usa-label" htmlFor="name">
                  Name
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="name"
                  name="name"
                  type="text"
                  value={form.name || ''}
                  onBlur={() => {
                    validateAttorneyUserSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </FormGroup>

              <FormGroup errorText={validationErrors.email}>
                <label className="usa-label" htmlFor="email">
                  Email {/* TODO: Should this be required? */}
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="email"
                  name="email"
                  type="text"
                  value={form.email || ''}
                  onBlur={() => {
                    validateAttorneyUserSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </FormGroup>

              <Select
                error={validationErrors.roles}
                formatter={role => capitalize(role)}
                id="role"
                keys={v => v}
                label="Select role"
                name="role"
                values={createAttorneyUserHelper.roles}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateAttorneyUserSequence();
                }}
              />

              <FormGroup errorText={validationErrors.barNumber}>
                <label className="usa-label" htmlFor="barNumber">
                  Bar Number {/* TODO: Should this be required? */}
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="barNumber"
                  name="barNumber"
                  type="text"
                  value={form.barNumber || ''}
                  onBlur={() => {
                    validateAttorneyUserSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </FormGroup>

              <UserContactEditForm
                bind="form"
                changeCountryTypeSequence="countryTypeFormContactChangeSequence"
                type="contact"
                updateSequence="updateFormValueSequence"
                validateSequence="validateAttorneyUserSequence"
                onBlurSequence="validateAttorneyUserSequence"
              />

              <Button
                onClick={() => {
                  submitCreateAttorneyUserSequence();
                }}
              >
                Save
              </Button>
              <Button link onClick={() => navigateBackSequence()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  },
);
