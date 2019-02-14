import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Address from './Address';
import Email from './Email';

export default connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function PetitionerAndSpouseContact({ form, updateFormValueSequence }) {
    return (
      <React.Fragment>
        <div className="usa-form-group">
          <h3>Tell Us About Yourself</h3>
          <div className="blue-container">
            <div className="usa-form-group">
              <label htmlFor="name">Name</label>
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
              />
            </div>
            <Address type="contactPrimary" />
            <Email type="contactPrimary" />
            <div className="usa-form-group">
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
              />
            </div>
          </div>
        </div>
        <div className="usa-form-group">
          <h3>Tell Us About Your Spouse</h3>
          <div className="blue-container">
            <div className="usa-form-group">
              <label htmlFor="secondaryName">Spouse&#39;s Name</label>
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
              />
            </div>
            <Address type="contactSecondary" />
            <div className="usa-form-group">
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
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
