import { checkA11y } from '../../../../support/generalCommands/checkA11y';

describe('Todays Orders - Accessibility', () => {
  beforeEach(() => {
    cy.clearAllCookies();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/todays-orders');
    cy.get('.todays-orders').should('exist');

    checkA11y();
  });
});
