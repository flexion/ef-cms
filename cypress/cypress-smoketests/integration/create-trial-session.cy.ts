import { faker } from '@faker-js/faker';

faker.seed(faker.number.int());

describe('trial sessions', () => {
  it('a petitionsclerk should be able to create a trial session', () => {
    cy.login('petitionsclerk1');
    cy.get('[data-testid="inbox-tab-content"]').should('exist');
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get('[data-testid="add-trial-session"]').click();
    cy.get('#start-date-picker').clear();
    cy.get('#start-date-picker').type('02/02/2099');
    cy.get('#estimated-end-date-picker').clear();
    cy.get('#estimated-end-date-picker').type('02/02/2100');
    cy.get('[data-testid="session-type-Hybrid"]').click();
    cy.get('[data-testid="max-cases"]').clear();
    cy.get('[data-testid="max-cases"]').type('10');
    cy.get('[data-testid="inPerson-proceeding-label"]').click();
    cy.get('[data-testid="trial-location"]').select('Anchorage, Alaska');
    cy.get('[data-testid="courthouse-name"]').clear();
    cy.get('[data-testid="courthouse-name"]').type('a courthouse');
    cy.get('[data-testid="city"]').clear();
    cy.get('[data-testid="city"]').type('cleveland');
    cy.get('[data-testid="state"]').select('TN');
    cy.get('[data-testid="postal-code"]').clear();
    cy.get('[data-testid="postal-code"]').type('33333');
    cy.get('[data-testid="judgeId"]').select(
      'dabbad02-18d0-43ec-bafb-654e83405416',
    );
    cy.get('[data-testid="trial-clerk"]').select(
      'd1f8a729-cbfa-4d22-a09b-73743a12f188',
    );
    cy.get('[data-testid="submit-trial-session"]').click();
    cy.get('[data-testid="success-alert"]').should('exist');
  });
});
