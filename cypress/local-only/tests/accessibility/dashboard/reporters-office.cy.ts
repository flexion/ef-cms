import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { loginAsReportersOffice } from '../../../../helpers/authentication/login-as-helpers';

describe('Dashboard Page - Reporters Office Accessibility', () => {
  beforeEach(() => {
    cy.clearAllCookies();
  });

  it('should be free of a11y issues', () => {
    loginAsReportersOffice();

    checkA11y();
  });
});
