import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Remove Petitioner Modal - Docket Clerk Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsDocketClerk();

    cy.visit(
      '/case-detail/101-20/edit-petitioner-information/7805d1ab-18d0-43ec-bafb-654e83405416',
    );
    cy.get('[data-testid="remove-petitioner-button"]').click();

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
      },
      terminalLog,
    );
  });
});
