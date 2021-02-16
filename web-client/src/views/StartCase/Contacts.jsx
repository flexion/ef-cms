import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';
import { EditPetitionerLoginForm } from '../EditPetitionerLoginForm';
import { ServiceIndicatorRadios } from '../ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import React from 'react';

export const Contacts = connect(
  {},
  function Contacts({
    bind,
    contactPrimaryDisplayEmail,
    contactPrimaryHasEmail,
    contactSecondaryDisplayEmail,
    contactSecondaryHasEmail,
    contactsHelper,
    onBlur,
    onChange,
    parentView,
    showLoginAndServiceInformation,
    showPrimaryContact,
    showSecondaryContact,
    useSameAsPrimary,
    validateSequence,
    wrapperClassName,
  }) {
    return (
      <React.Fragment>
        {showPrimaryContact && (
          <>
            <ContactPrimary
              bind={bind}
              contactsHelper={contactsHelper}
              parentView={parentView}
              wrapperClassName={wrapperClassName}
              onBlur={onBlur}
              onChange={onChange}
            />
            {showLoginAndServiceInformation && (
              <>
                <h4>Login &amp; Service Information</h4>
                <div className="blue-container margin-bottom-6">
                  <ServiceIndicatorRadios
                    bind="form.contactPrimary"
                    hideElectronic={!contactPrimaryHasEmail}
                    validateSequence={validateSequence}
                    validationErrors="validationErrors.contactPrimary"
                  />
                  <div className="margin-top-4">
                    {contactPrimaryHasEmail && (
                      <span>{contactPrimaryDisplayEmail}</span>
                    )}

                    {!contactPrimaryHasEmail && (
                      <EditPetitionerLoginForm type="contactPrimary" />
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {showSecondaryContact && (
          <>
            <ContactSecondary
              bind={bind}
              contactsHelper={contactsHelper}
              parentView={parentView}
              useSameAsPrimary={useSameAsPrimary}
              wrapperClassName={wrapperClassName}
              onBlur={onBlur}
              onChange={onChange}
            />
            {showLoginAndServiceInformation && (
              <>
                <h4>Login &amp; Service Information</h4>
                <div className="blue-container margin-bottom-6">
                  <ServiceIndicatorRadios
                    bind="form.contactSecondary"
                    hideElectronic={!contactSecondaryHasEmail}
                    validateSequence={validateSequence}
                    validationErrors="validationErrors.contactSecondary"
                  />
                  <div className="margin-top-4">
                    {contactSecondaryHasEmail && (
                      <span>{contactSecondaryDisplayEmail}</span>
                    )}

                    {!contactSecondaryHasEmail && (
                      <EditPetitionerLoginForm type="contactSecondary" />
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </React.Fragment>
    );
  },
);
