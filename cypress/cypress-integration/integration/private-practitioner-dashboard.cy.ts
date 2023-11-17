import { navigateTo as loginAs } from '../support/pages/maintenance';
import { petitionerCreatesACase } from '../support/setup/petitioner-creates-a-case';

describe('Private practitioner views dashboard', () => {
  it('should display filing fee column', () => {
    loginAs('privatepractitioner');
    cy.getByTestId('filing-fee');
    petitionerCreatesACase().then(docketNumber => {
      cy.getByTestId('filing-fee');
      cy.getByTestId(docketNumber)
        .find('[data-testid="petition-payment-status"]')
        .should('have.text', 'Not paid');
    });
  });
});
