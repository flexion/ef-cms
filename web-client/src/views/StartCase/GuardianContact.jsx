import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Address from './Address';
import Email from './Email';

export default connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function GuardianContact({
    form,
    updateFormValueSequence,
    validationErrors,
  }) {
    validationErrors.contactPrimary = validationErrors.contactPrimary || {};
    validationErrors.contactSecondary = validationErrors.contactSecondary || {};
    return (
      <React.Fragment>
        <div className="usa-form-group contact-group">
          <h3>Tell Us About the Guardian for This Taxpayer</h3>
          <div className="blue-container">
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactPrimary.name ? 'usa-input-error' : '')
              }
            >
              <label htmlFor="name">Name of Guardian</label>
              <input
                id="name"
                type="text"
                name="contactPrimary.name"
                autoCapitalize="none"
                value={form.contactPrimary.name || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />{' '}
              <div className="usa-input-error-message beneath">
                {validationErrors.contactPrimary.name}
              </div>
            </div>
            <Address type="contactPrimary" />
            <Email />
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactPrimary.phone ? 'usa-input-error' : '')
              }
            >
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="contactPrimary.phone"
                className="ustc-input-phone"
                autoCapitalize="none"
                value={form.contactPrimary.phone || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />{' '}
              <div className="usa-input-error-message beneath">
                {validationErrors.contactPrimary.phone}
              </div>
            </div>
          </div>
        </div>
        <div className="usa-form-group">
          <h3>Tell Us About the Taxpayer You Are Filing For</h3>
          <div className="blue-container">
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactSecondary.name
                  ? 'usa-input-error'
                  : '')
              }
            >
              <label htmlFor="secondaryName">Name of Taxpayer</label>
              <input
                id="secondaryName"
                type="text"
                name="contactSecondary.name"
                autoCapitalize="none"
                value={form.contactSecondary.name || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />{' '}
              <div className="usa-input-error-message beneath">
                {validationErrors.contactSecondary.name}
              </div>
            </div>{' '}
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactSecondary.inCareOf
                  ? 'usa-input-error'
                  : '')
              }
            >
              <label htmlFor="secondaryInCareOf">
                In Care Of <span className="usa-form-hint">(optional)</span>
              </label>
              <input
                id="secondaryInCareOf"
                type="text"
                name="contactSecondary.inCareOf"
                autoCapitalize="none"
                value={form.contactSecondary.inCareOf || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />{' '}
              <div className="usa-input-error-message beneath">
                {validationErrors.contactSecondary.inCareOf}
              </div>
            </div>
            <Address type="contactSecondary" />
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactSecondary.phone
                  ? 'usa-input-error'
                  : '')
              }
            >
              <label htmlFor="secondaryPhone">Phone Number</label>
              <input
                id="secondaryPhone"
                type="tel"
                name="contactSecondary.phone"
                className="ustc-input-phone"
                autoCapitalize="none"
                value={form.contactSecondary.phone || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />{' '}
              <div className="usa-input-error-message beneath">
                {validationErrors.contactSecondary.phone}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
