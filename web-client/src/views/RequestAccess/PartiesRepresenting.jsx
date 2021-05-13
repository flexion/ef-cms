import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesRepresenting = connect(
  {
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    requestAccessHelper: state.requestAccessHelper,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
  },
  function PartiesRepresenting({
    form,
    formattedCaseDetail,
    requestAccessHelper,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
  }) {
    return (
      <React.Fragment>
        <h2 className="margin-top-4">
          Tell Us About the Parties You’re Representing
        </h2>
        <div className="blue-container">
          <FormGroup errorText={requestAccessHelper.partyValidationError}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="with-hint" id="who-legend">
                Who are you representing?
              </legend>
              <span className="usa-hint">Check all that apply</span>
              {formattedCaseDetail.petitioners.map(petitioner => (
                <div className="usa-checkbox" key={petitioner.name}>
                  <input
                    checked={form.filersMap[petitioner.name] || false}
                    className="usa-checkbox__input"
                    id={`filing-${petitioner.name}`}
                    name={`filersMap.${petitioner.name}`}
                    type="checkbox"
                    onChange={e => {
                      updateCaseAssociationFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateCaseAssociationRequestSequence();
                    }}
                  />
                  <label
                    className="usa-checkbox__label inline-block"
                    htmlFor={`filing-${petitioner.name}`}
                  >
                    {petitioner.name}
                  </label>
                </div>
              ))}
            </fieldset>
          </FormGroup>
        </div>
      </React.Fragment>
    );
  },
);
