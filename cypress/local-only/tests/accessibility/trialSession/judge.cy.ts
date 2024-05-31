import { impactLevel } from '../../../../helpers/accessibility-impact';
import { loginAsColvin } from '../../../../helpers/authentication/login-as-helpers';
import { terminalLog } from '../../../../helpers/cypressTasks/logs';

describe('Trial Sessions Page - Judge Accessibility', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should be free of a11y issues', () => {
    loginAsColvin();
    cy.visit('/trial-sessions');
    cy.get('#trial-sessions-tabs').should('exist');

    cy.injectAxe();

    cy.checkA11y(
      undefined,
      {
        includedImpacts: impactLevel,
        rules: {
          'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
          'nested-interactive': { enabled: false }, // TODO LINK
        },
      },
      terminalLog,
    );
  });

  describe('Trial session details', () => {
    it('should be free of a11y issues', () => {
      loginAsColvin();
      cy.visit('/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc');
      cy.contains('Session Information').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });

  describe('Trial session working copy', () => {
    it('should be free of a11y issues', () => {
      loginAsColvin();
      cy.visit(
        '/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      );
      cy.contains('Session Copy').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });

    it('should be free of a11y issues when printing', () => {
      loginAsColvin();
      cy.visit(
        '/trial-session-working-copy/959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      );
      cy.contains('Session Copy').should('exist');
      cy.get('#print-session-working-copy').click();
      cy.get('.modal-screen').should('exist');
      cy.get('#modal-button-confirm').click();
      cy.get('.pdf-preview-viewer').should('exist');

      cy.injectAxe();

      cy.checkA11y(
        undefined,
        {
          includedImpacts: impactLevel,
          rules: {
            'color-contrast': { enabled: false }, // Ignore contrast as it's good enough for now
            'nested-interactive': { enabled: false }, // TODO LINK
          },
        },
        terminalLog,
      );
    });
  });
});
