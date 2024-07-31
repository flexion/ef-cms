import { loginAsIrsPractitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('IRS practitioner views dashboard', () => {
  it('should NOT have a column for filing fee in the case list table', () => {
    loginAsIrsPractitioner('irsPractitioner@example.com');
    cy.get('[data-testid="case-list-table"]');
    cy.get('[data-testid="filing-fee"]').should('not.exist');
    cy.get('[data-testid="petition-payment-status"]').should('not.exist');
  });
});
