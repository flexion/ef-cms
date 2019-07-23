import { Address } from './Address';
import { Country } from './Country';
import { Email } from './Email';
import { InternationalAddress } from './InternationalAddress';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ContactPrimary = connect(
  {
    bind: props.bind,
    constants: state.constants,
    contactsHelper: state[props.contactsHelper],
    data: state[props.bind],
    emailBind: props.emailBind,
    onBlur: props.onBlur,
    onBlurSequence: sequences[props.onBlur],
    onChange: props.onChange,
    onChangeSequence: sequences[props.onChange],
    parentView: props.parentView,
    validationErrors: state.validationErrors,
  },
  ({
    bind,
    constants,
    contactsHelper,
    data,
    emailBind,
    onBlur,
    onBlurSequence,
    onChange,
    onChangeSequence,
    parentView,
    validationErrors,
  }) => {
    return (
      <>
        {parentView === 'StartCase' ? (
          <h2 className="margin-top-4">
            {contactsHelper.contactPrimary.header}
          </h2>
        ) : (
          <h4>{contactsHelper.contactPrimary.header}</h4>
        )}
        <div className="blue-container contact-group">
          <Country
            bind={bind}
            type="contactPrimary"
            onBlur={onBlur}
            onChange={onChange}
          />
          <div
            className={
              'usa-form-group ' +
              (validationErrors.contactPrimary &&
              validationErrors.contactPrimary.name
                ? 'usa-form-group--error'
                : '')
            }
          >
            <label className="usa-label" htmlFor="name">
              {contactsHelper.contactPrimary.nameLabel}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id="name"
              name="contactPrimary.name"
              type="text"
              value={data.contactPrimary.name || ''}
              onBlur={() => {
                onBlurSequence();
              }}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <Text
              bind="validationErrors.contactPrimary.name"
              className="usa-error-message"
            />
          </div>
          {contactsHelper.contactPrimary.displayTitle && (
            <div className="usa-form-group">
              <label className="usa-label with-hint" htmlFor="title">
                Title
              </label>
              <span className="usa-hint">For example, Executor, PR, etc.</span>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="title"
                name="contactPrimary.title"
                type="text"
                value={data.contactPrimary.title || ''}
                onChange={e => {
                  onChangeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
          )}
          {contactsHelper.contactPrimary.displayInCareOf && (
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactPrimary &&
                validationErrors.contactPrimary.inCareOf
                  ? 'usa-form-group--error'
                  : '')
              }
            >
              <label className="usa-label" htmlFor="inCareOf">
                {contactsHelper.contactPrimary.inCareOfLabel ? (
                  <span>
                    {contactsHelper.contactPrimary.inCareOfLabel}{' '}
                    {contactsHelper.contactPrimary.inCareOfLabelHint && (
                      <span className="usa-hint">
                        ({contactsHelper.contactPrimary.inCareOfLabelHint})
                      </span>
                    )}
                  </span>
                ) : (
                  <span>
                    In Care Of <span className="usa-hint">(optional)</span>
                  </span>
                )}
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="inCareOf"
                name="contactPrimary.inCareOf"
                type="text"
                value={data.contactPrimary.inCareOf || ''}
                onBlur={() => {
                  onBlurSequence();
                }}
                onChange={e => {
                  onChangeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              <Text
                bind="validationErrors.contactPrimary.inCareOf"
                className="usa-error-message"
              />
            </div>
          )}
          {data.contactPrimary.countryType ===
            constants.COUNTRY_TYPES.DOMESTIC && (
            <Address
              bind={bind}
              type="contactPrimary"
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          {data.contactPrimary.countryType ===
            constants.COUNTRY_TYPES.INTERNATIONAL && (
            <InternationalAddress
              bind={bind}
              type="contactPrimary"
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          {contactsHelper.showEmail && <Email bind={emailBind} />}
          <div
            className={
              'usa-form-group phone-input ' +
              (validationErrors.contactPrimary &&
              validationErrors.contactPrimary.phone
                ? 'usa-form-group--error'
                : '')
            }
          >
            <label className="usa-label" htmlFor="phone">
              Phone Number
              {contactsHelper.contactPrimary.phoneNumberLabelHint && (
                <span>
                  {' '}
                  <span className="usa-hint">
                    ({contactsHelper.contactPrimary.phoneNumberLabelHint})
                  </span>
                </span>
              )}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id="phone"
              name="contactPrimary.phone"
              type="tel"
              value={data.contactPrimary.phone || ''}
              onBlur={() => {
                onBlurSequence();
              }}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <Text
              bind="validationErrors.contactPrimary.phone"
              className="usa-error-message"
            />
          </div>
        </div>
      </>
    );
  },
);
