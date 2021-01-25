import { Address } from './StartCase/Address';
import { Button } from '../ustc-ui/Button/Button';
import { Country } from './StartCase/Country';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const UserContactEditForm = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    bind: props.bind,
    changeCountryTypeSequence: props.changeCountryTypeSequence,
    form: state.form,
    onBlurSequenceName: props.onBlurSequenceName,
    onBlurValidationSequence: sequences[props.onBlurSequenceName],
    onChangeSequenceName: props.onChangeSequenceName,
    onChangeUpdateSequence: sequences[props.onChangeSequenceName],
    screenMetadata: state.screenMetadata,
    type: props.type,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validationErrors: state.validationErrors,
  },
  function UserContactEditForm({
    bind,
    changeCountryTypeSequence,
    COUNTRY_TYPES,
    form,
    onBlurSequenceName,
    onBlurValidationSequence,
    onChangeSequenceName,
    onChangeUpdateSequence,
    screenMetadata,
    type,
    updateScreenMetadataSequence,
    validationErrors,
  }) {
    return (
      <>
        <Country
          bind={bind}
          type={type}
          onBlur={onBlurSequenceName}
          onChange={onChangeSequenceName}
          onChangeCountryType={changeCountryTypeSequence}
        />
        {form.contact.countryType === COUNTRY_TYPES.DOMESTIC ? (
          <Address
            bind={bind}
            type={type}
            onBlur={onBlurSequenceName}
            onChange={onChangeSequenceName}
          />
        ) : (
          <InternationalAddress
            bind={bind}
            type={type}
            onBlur={onBlurSequenceName}
            onChange={onChangeSequenceName}
          />
        )}
        <FormGroup
          errorText={
            validationErrors &&
            validationErrors.contact &&
            validationErrors.contact.phone
          }
        >
          <label className="usa-label margin-bottom-0" htmlFor="phone">
            Phone number
          </label>
          <span className="usa-hint">
            If you do not have a current phone number, enter N/A.
          </span>
          <input
            autoCapitalize="none"
            className="usa-input max-width-200"
            id="phone"
            name="contact.phone"
            type="tel"
            value={form.contact.phone || ''}
            onBlur={() => {
              onBlurValidationSequence();
            }}
            onChange={e => {
              onChangeUpdateSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>

        {screenMetadata.isEditingEmail ? (
          <>
            <FormGroup
              errorText={
                validationErrors &&
                validationErrors.contact &&
                validationErrors.contact.email
              }
            >
              <label className="usa-label margin-bottom-0" htmlFor="email">
                Email address
              </label>
              <span className="usa-hint">
                This is the email you will use to log in to the system and where
                you will receive service.
              </span>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="email"
                name="email"
                type="text"
                value={form.email || ''}
                onBlur={() => {
                  onBlurValidationSequence();
                }}
                onChange={e => {
                  onChangeUpdateSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
            <FormGroup
              errorText={
                validationErrors &&
                validationErrors.contact &&
                validationErrors.contact.confirmEmail
              }
            >
              <label className="usa-label" htmlFor="confirm-email">
                Re-enter email address
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="confirm-email"
                name="confirmEmail"
                type="text"
                value={form.confirmEmail || ''}
                onBlur={() => {
                  onBlurValidationSequence();
                }}
                onChange={e => {
                  onChangeUpdateSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </>
        ) : (
          <div>
            <label
              className="usa-label margin-bottom-0"
              htmlFor="original-email-address"
            >
              Email address
            </label>
            <p className="margin-top-0" name="original-email-address">
              {form.originalEmail}
              <Button
                link
                className="margin-left-2"
                icon="edit"
                id="edit-user-email-button"
                onClick={() => {
                  updateScreenMetadataSequence({
                    key: 'isEditingEmail',
                    value: true,
                  });
                }}
              >
                Edit
              </Button>
            </p>
          </div>
        )}
      </>
    );
  },
);
