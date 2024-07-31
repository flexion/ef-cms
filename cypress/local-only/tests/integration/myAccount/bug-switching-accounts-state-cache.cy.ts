import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('BUG: State not recomputing when switching accounts', () => {
  const PRIVATE_PRACTITIONER_ACCOUNT = 'privatePractitioner1';

  it('should show the my contact information card when logging in as a petitioner, then logging in as a practitioner', () => {
    loginAsPetitioner('petitioner1@example.com');
    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="my-account-link"]').click();

    cy.get('[data-testid="user-service-email"]').should('exist');
    cy.get('[data-testid="my-contact-information-card"]').should('not.exist');

    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="logout-button-desktop"]').click();

    cy.get('[data-testid="email-input"]').type(
      `${PRIVATE_PRACTITIONER_ACCOUNT}@example.com`,
    );
    cy.get('[data-testid="password-input"]').type(
      getCypressEnv().defaultAccountPass,
    );
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="account-menu-button"]').click();
    cy.get('[data-testid="my-account-link"]').click();

    cy.get('[data-testid="user-service-email"]').should('exist');
    cy.get('[data-testid="my-contact-information-card"]').should('exist');
  });
});
