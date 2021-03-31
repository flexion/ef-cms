import { Address } from './StartCase/Address';
import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { Country } from './StartCase/Country';
import { ErrorNotification } from './ErrorNotification';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerInformationInternal = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    contactEditHelper: state.contactEditHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
    submitEditPrimaryContactSequence:
      sequences.submitEditPrimaryContactSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePrimaryContactSequence: sequences.validatePrimaryContactSequence,
    validationErrors: state.validationErrors,
  },
  function EditPetitionerInformationInternal({
    contactEditHelper,
    COUNTRY_TYPES,
    form,
    formCancelToggleCancelSequence,
    showModal,
    submitEditPrimaryContactSequence,
    updateFormValueSequence,
    validatePrimaryContactSequence,
    validationErrors,
  }) {
    const type = 'contactPrimary';
    const bind = 'form';
    const onBlur = 'validatePrimaryContactSequence';

    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <ErrorNotification />

          <h2>Edit Petitioner Information</h2>

          <h3>Contact Information</h3>

          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group">
              <p className="usa-label margin-bottom-0">Contact name</p>
              <p className="margin-top-0">{form.contactPrimary.name}</p>
            </div>

            {contactEditHelper.contactPrimary?.showInCareOf && (
              <FormGroup errorText={validationErrors.contactPrimary?.inCareOf}>
                <label className="usa-label" htmlFor="inCareOf">
                  <span>In care of</span>
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="inCareOf"
                  name="contactPrimary.inCareOf"
                  type="text"
                  value={form.contactPrimary.inCareOf || ''}
                  onBlur={() => {
                    validatePrimaryContactSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </FormGroup>
            )}

            <Country
              bind={bind}
              clearTypeOnCountryChange={true}
              type={type}
              onChange="contactPrimaryCountryTypeChangeSequence"
            />
            {form.contactPrimary.countryType === COUNTRY_TYPES.DOMESTIC ? (
              <Address
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateFormValueSequence"
              />
            ) : (
              <InternationalAddress
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateFormValueSequence"
              />
            )}
            <FormGroup
              errorText={
                validationErrors &&
                validationErrors.contactPrimary &&
                validationErrors.contactPrimary.phone
              }
            >
              <label className="usa-label" htmlFor="phone">
                Phone number
              </label>
              <span className="usa-hint">
                If you do not have a current phone number, enter N/A.
              </span>
              <input
                autoCapitalize="none"
                className="usa-input max-width-200"
                id="phone"
                name="contactPrimary.phone"
                type="tel"
                value={form.contactPrimary.phone || ''}
                onBlur={() => {
                  validatePrimaryContactSequence();
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
          <Button
            onClick={() => {
              submitEditPrimaryContactSequence();
            }}
          >
            Save
          </Button>
          <Button
            link
            onClick={() => {
              formCancelToggleCancelSequence();
              return false;
            }}
          >
            Cancel
          </Button>
        </section>

        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
      </>
    );
  },
);
