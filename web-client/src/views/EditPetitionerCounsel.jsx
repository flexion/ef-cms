import { AddressDisplay } from './CaseDetail/AddressDisplay';
import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { MatchingEmailFoundModal } from './CaseDetail/MatchingEmailFoundModal';
import { NoMatchingEmailFoundModal } from './CaseDetail/NoMatchingEmailFoundModal';
import { RemovePetitionerCounselModal } from './CaseDetail/RemovePetitionerCounselModal';
import { ServiceIndicatorRadios } from './ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerCounsel = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    caseDetailContactHelper: state.caseDetailContactHelper,
    editPetitionerInformationHelper: state.editPetitionerInformationHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openRemovePetitionerCounselModalSequence:
      sequences.openRemovePetitionerCounselModalSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    submitEditPetitionerCounselSequence:
      sequences.submitEditPetitionerCounselSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateEditPetitionerCounselSequence:
      sequences.validateEditPetitionerCounselSequence,
    validatePetitionerSequence: sequences.validatePetitionerSequence,
    validationErrors: state.validationErrors,
  },
  function EditPetitionerCounsel({
    caseDetailContactHelper,
    form,
    formCancelToggleCancelSequence,
    openRemovePetitionerCounselModalSequence,
    showModal,
    submitEditPetitionerCounselSequence,
    updateFormValueSequence,
    validateEditPetitionerCounselSequence,
    validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <ErrorNotification />

          <h2>Edit Petitioner Counsel</h2>

          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group">
              <address aria-labelledby="practitioner-label">
                {form.name && (
                  <AddressDisplay
                    boldName
                    showEmail
                    contact={{
                      ...form,
                      ...form.contact,
                    }}
                    nameOverride={form.name}
                  />
                )}
              </address>

              <FormGroup
                className="margin-bottom-0"
                errorText={
                  validationErrors && validationErrors.representingPrimary
                }
                id={'practitioner-representing'}
              >
                <fieldset className="usa-fieldset margin-bottom-0">
                  <legend
                    className="usa-legend"
                    id={'practitioner-representing-legend'}
                  >
                    Representing
                  </legend>
                  <div className="usa-checkbox">
                    <input
                      aria-describedby={'practitioner-representing-legend'}
                      checked={form.representingPrimary || false}
                      className="usa-checkbox__input"
                      id={'representing-primary'}
                      name={'representingPrimary'}
                      type="checkbox"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateEditPetitionerCounselSequence();
                      }}
                    />
                    <label
                      className="usa-checkbox__label inline-block"
                      htmlFor={'representing-primary'}
                    >
                      {caseDetailContactHelper.contactPrimary.name}
                    </label>
                  </div>

                  {caseDetailContactHelper.contactSecondary &&
                    caseDetailContactHelper.contactSecondary.name && (
                      <div className="usa-checkbox">
                        <input
                          aria-describedby={'practitioner-representing-legend'}
                          checked={form.representingSecondary || false}
                          className="usa-checkbox__input"
                          id={'representing-secondary'}
                          name={'representingSecondary'}
                          type="checkbox"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.checked,
                            });
                            validateEditPetitionerCounselSequence();
                          }}
                        />
                        <label
                          className="usa-checkbox__label inline-block"
                          htmlFor={'representing-secondary'}
                        >
                          {caseDetailContactHelper.contactSecondary.name}
                        </label>
                      </div>
                    )}
                </fieldset>
                <div className="margin-top-2">
                  <ServiceIndicatorRadios
                    bind={'form'}
                    getValidationError={() =>
                      validationErrors && validationErrors.serviceIndicator
                    }
                    validateSequence={validateEditPetitionerCounselSequence}
                  />
                </div>
              </FormGroup>
            </div>
          </div>

          <div>
            <Button
              id="submit-edit-petitioner-information"
              onClick={() => {
                submitEditPetitionerCounselSequence();
              }}
            >
              Save
            </Button>
            <Button
              link
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </Button>

            <Button
              link
              className="red-warning no-wrap float-right"
              icon="trash"
              id="remove-petitioner-btn"
              onClick={() => {
                openRemovePetitionerCounselModalSequence();
              }}
            >
              Remove petitioner counsel
            </Button>
          </div>
        </section>

        {showModal === 'MatchingEmailFoundModal' && <MatchingEmailFoundModal />}
        {showModal === 'NoMatchingEmailFoundModal' && (
          <NoMatchingEmailFoundModal />
        )}
        {showModal === 'RemovePetitionerCounselModal' && (
          <RemovePetitionerCounselModal />
        )}
      </>
    );
  },
);
