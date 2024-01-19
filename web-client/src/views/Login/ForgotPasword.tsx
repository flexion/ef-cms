import { Button } from '@web-client/ustc-ui/Button/Button';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ForgotPassword = connect(
  {
    submitForgotPasswordSequence: sequences.submitForgotPasswordSequence,
    updateAuthenticationFormValueSequence:
      sequences.updateAuthenticationFormValueSequence,
  },
  ({ submitForgotPasswordSequence, updateAuthenticationFormValueSequence }) => {
    return (
      <>
        <section className="grid-container usa-section margin-top-4">
          <div className="grid-row flex-justify-center">
            <div className="grid-col-12 desktop:grid-col-4 tablet:grid-col-7">
              <SuccessNotification isDismissable={false} />
              <ErrorNotification />
              <div className="grid-container bg-white padding-y-3 border border-base-lighter">
                <div className="display-flex flex-column">
                  <div className="flex-align-self-center">
                    <h1 className="margin-bottom-1">Forgot Password?</h1>
                    <form className="usa-form margin-top-4">
                      <label className="usa-label" htmlFor="email">
                        Email address
                      </label>
                      <input
                        required
                        autoCapitalize="off"
                        autoCorrect="off"
                        className="usa-input"
                        data-testid="email-input"
                        name="email"
                        type="email"
                        onChange={e => {
                          updateAuthenticationFormValueSequence({
                            email: e.target.value,
                          });
                        }}
                      />
                      <Button
                        className="usa-button margin-top-3"
                        data-testid="forgot-password-button"
                        onClick={e => {
                          e.preventDefault();
                          submitForgotPasswordSequence();
                        }}
                      >
                        Send Password Reset
                      </Button>
                      <p>
                        If you have no longer have access to the email address
                        on file, contact{' '}
                        <a href="mailto:dawson.support@ustaxcourt.gov">
                          dawson.support@ustaxcourt.gov
                        </a>
                        .
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
