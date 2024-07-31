import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('Pending Report - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    cy.clearAllCookies();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit('/reports/pending-report');
    cy.get('[data-testid="pending-report-container"]');

    checkA11y();
  });
});
