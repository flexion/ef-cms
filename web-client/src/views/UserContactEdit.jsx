import { Address } from './StartCase/Address';
import { Button } from '../ustc-ui/Button/Button';
import { Country } from './StartCase/Country';
import { ErrorNotification } from './ErrorNotification';
import { Hint } from '../ustc-ui/Hint/Hint';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { Text } from '../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const UserContactEdit = connect(
  {
    navigateBackSequence: sequences.navigateBackSequence,
    submitEditUserContactSequence: sequences.submitEditUserContactSequence,
    updateUserContactValueSequence: sequences.updateUserContactValueSequence,
    user: state.user,
    validateUserContactSequence: sequences.validateUserContactSequence,
    validationErrors: state.validationErrors,
  },
  ({
    navigateBackSequence,
    submitEditUserContactSequence,
    updateUserContactValueSequence,
    user,
    validateUserContactSequence,
    validationErrors,
  }) => {
    const type = 'contact';
    const bind = 'user';
    const onBlur = 'validateUserContactSequence';

    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <h1>Edit Contact Information</h1>
          </div>
        </div>
        <section className="usa-section grid-container">
          <ErrorNotification />

          <p>
            This form will automatically create and submit change of contact
            information notifications for all of your cases. Please ensure your
            information is accurate before submitting.
          </p>

          <Hint wider>
            For name and Bar Number changes, please contact the Court’s
            Admissions section at (202) 521-0700
          </Hint>

          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group">
              <p className="usa-label">Contact name</p>
              <p className="margin-top-0">
                {user.name} ({user.barNumber})
              </p>
            </div>

            <Country
              bind={bind}
              type={type}
              onBlur={onBlur}
              onChange="updateUserContactValueSequence"
              onChangeCountryType="countryTypeUserContactChangeSequence"
            />
            {user.contact.countryType === 'domestic' ? (
              <Address
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateUserContactValueSequence"
              />
            ) : (
              <InternationalAddress
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateUserContactValueSequence"
              />
            )}
            <div
              className={classNames(
                'usa-form-group margin-bottom-0',
                validationErrors &&
                  validationErrors.contact &&
                  validationErrors.contact.phone &&
                  'usa-form-group--error',
              )}
            >
              <label className="usa-label" htmlFor="phone">
                Phone number
              </label>
              <input
                autoCapitalize="none"
                className="usa-input max-width-200"
                id="phone"
                name="contact.phone"
                type="tel"
                value={user.contact.phone || ''}
                onBlur={() => {
                  validateUserContactSequence();
                }}
                onChange={e => {
                  updateUserContactValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              <Text
                bind={'validationErrors.contact.phone'}
                className="usa-error-message"
              />
            </div>
          </div>
          <Button
            onClick={() => {
              submitEditUserContactSequence();
            }}
          >
            Save
          </Button>
          <Button link onClick={() => navigateBackSequence()}>
            Cancel
          </Button>
        </section>
      </>
    );
  },
);
