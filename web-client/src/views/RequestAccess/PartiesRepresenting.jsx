import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesRepresenting = connect(
  {
    caseDetail: state.formattedCaseDetail,
    form: state.form,
    requestAccessHelper: state.requestAccessHelper,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
  },
  ({
    caseDetail,
    requestAccessHelper,
    form,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
  }) => {
    return (
      <React.Fragment>
        <h2 className="margin-top-4">
          Tell Us About the Parties You’re Representing
        </h2>
        <div className="blue-container">
          <div
            className={`usa-form-group ${
              requestAccessHelper.partyValidationError
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <fieldset className="usa-fieldset">
              <legend className="with-hint" id="who-legend">
                Who Are You Representing?
              </legend>
              <span className="usa-hint">Check all that apply.</span>
              <div className="usa-checkbox">
                <input
                  id="party-primary"
                  type="checkbox"
                  name="representingPrimary"
                  aria-describedby="who-legend"
                  className="usa-checkbox__input"
                  checked={form.representingPrimary || false}
                  onChange={e => {
                    updateCaseAssociationFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateCaseAssociationRequestSequence();
                  }}
                />
                <label htmlFor="party-primary" className="usa-checkbox__label">
                  {caseDetail.contactPrimary.name}
                </label>
              </div>
              {requestAccessHelper.showSecondaryParty && (
                <div className="usa-checkbox">
                  <input
                    id="party-secondary"
                    type="checkbox"
                    aria-describedby="who-legend"
                    name="representingSecondary"
                    className="usa-checkbox__input"
                    checked={form.representingSecondary || false}
                    onChange={e => {
                      updateCaseAssociationFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateCaseAssociationRequestSequence();
                    }}
                  />
                  <label
                    htmlFor="party-secondary"
                    className="usa-checkbox__label"
                  >
                    {caseDetail.contactSecondary.name}
                  </label>
                </div>
              )}
            </fieldset>
            {requestAccessHelper.partyValidationError && (
              <span className="usa-error-message">
                {requestAccessHelper.partyValidationError}
              </span>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  },
);
