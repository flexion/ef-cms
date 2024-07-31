import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';

describe('Judge Activity Report - Judge Accessibility', () => {
  beforeEach(() => {
    cy.clearAllCookies();
  });

  it('should be free of a11y issues', () => {
    loginAsColvin();
    cy.visit('/reports/judge-activity-report');
    cy.get('[data-testid="view-statistics-button"]').should('exist');

    checkA11y();
  });
});
