/* eslint-disable quotes */
import { DEFAULT_FORGOT_PASSWORD_CODE } from '../../../../support/cognito-login';
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { v4 } from 'uuid';
import { verifyPasswordRequirements } from '../../../../helpers/auth/verify-password-requirements';

Given('I visit forgot password page', () => {
  cy.visit('/login');
  cy.get('[data-testid="forgot-password-button"]').click();
});

Given('I request a new forgot password code', () => {
  cy.get('[data-testid="request-new-forgot-password-code-button"]').click();
});

When('I enter an email without an account on forgot password page', () => {
  const emailWithoutAccount = `doesNotExist${v4()}@email.com`;
  cy.get('[data-testid="email-input"]').type(emailWithoutAccount);
  cy.get('[data-testid="send-password-reset-button"]').click();
});

When(`I enter {string} on forgot password page`, (email: string) => {
  cy.get('[data-testid="email-input"]').clear();
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="send-password-reset-button"]').click();
});

When(
  `I enter the default forgot password code with a new password of {string}`,
  (brandNewPassword: string) => {
    cy.get('[data-testid="change-password-button"]').should('be.disabled');

    verifyPasswordRequirements('[data-testid="new-password-input"]');

    cy.get('[data-testid="forgot-password-code"]').type(
      DEFAULT_FORGOT_PASSWORD_CODE,
    );
    cy.get('[data-testid="new-password-input"]').clear();
    cy.get('[data-testid="new-password-input"]').type(brandNewPassword);
    cy.get('[data-testid="confirm-new-password-input"]').clear();
    cy.get('[data-testid="confirm-new-password-input"]').type(brandNewPassword);
    cy.get('[data-testid="change-password-button"]').click();
  },
);

When(
  `I enter an incorrect password code with a new password of {string}`,
  (brandNewPassword: string) => {
    cy.get('[data-testid="forgot-password-code"]').type(
      'totally incorrect code',
    );
    cy.get('[data-testid="new-password-input"]').clear();
    cy.get('[data-testid="new-password-input"]').type(brandNewPassword);
    cy.get('[data-testid="confirm-new-password-input"]').clear();
    cy.get('[data-testid="confirm-new-password-input"]').type(brandNewPassword);
    cy.get('[data-testid="change-password-button"]').click();
  },
);

Then('I should see an alert that a password reset code has been sent', () => {
  cy.get('[data-testid="success-alert"]').should(
    'contain',
    'Password reset code sent',
  );
});

Then('I should see an alert that a confirmation email was resent', () => {
  cy.get('[data-testid="warning-alert"]').should(
    'contain',
    'We’ve sent you an email',
  );
});

Then(
  'I should see an alert that I have entered an invalid password reset code',
  () => {
    cy.get('[data-testid="error-alert"]').should(
      'contain',
      'Invalid verification code',
    );
  },
);
