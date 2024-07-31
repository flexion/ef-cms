import { checkA11y } from '../../../../support/generalCommands/checkA11y';

describe('Privacy - Accessibility', () => {
  beforeEach(() => {
    cy.clearAllCookies();
  });

  it('should be free of a11y issues', () => {
    cy.visit('/privacy');
    cy.contains('Privacy').should('exist');

    checkA11y();
  });
});
