import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';
import { updateCaseStatus } from '../../helpers/update-case-status';

describe('Verify the activity report', () => {
  it('should display an error message when invalid dates are entered into the form', () => {
    cy.login('judgecolvin');
    cy.get('[data-testid="dropdown-select-report"]').click();
    cy.get('[data-testid="activity-report-link"]').click();
    cy.get('[data-testid="view-statistics-button"]').should('be.disabled');
    cy.get(
      '.usa-date-picker__wrapper > [data-testid="deadlineStart-date-start-input"]',
    ).type('abc');
    cy.get(
      '.usa-date-picker__wrapper > [data-testid="deadlineEnd-date-end-input}"]',
    ).type('123');
    cy.get('[data-testid="view-statistics-button"]').click();
    cy.get('[data-testid="error-alert"]').should('be.visible');
    cy.get('[data-testid="deadlineStart-date-start"]').should('be.visible');
    cy.get('[data-testid="deadlineEnd-date-end}"]').should('be.visible');
    cy.get('[data-testid="activity-report-header"]').should(
      'contain',
      'Colvin',
    );
    cy.get('[data-testid="judge-select"]')
      .find('option:selected')
      .should('have.text', 'Colvin');
  });

  it('create a Submitted case and verify it shows up in the Submitted/CAV table', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.login('docketclerk');
      searchByDocketNumberInHeader(docketNumber);

      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="menu-edit-case-context-button"]').click();
      cy.get('[data-testid="case-status-select"]').select('Submitted');
      cy.get('[data-testid="associated-judge-select"]').select('Colvin');
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.login('judgecolvin');
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="activity-report-link"]').click();
      cy.get('[data-testid="submitted-and-cav-tab"]').click();
      cy.get(`[data-testid="${docketNumber}"]`).should('be.visible');
    });
  });

  it('create a CAV case and verify it shows up in the Submitted/CAV table', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.login('docketclerk');
      searchByDocketNumberInHeader(docketNumber);

      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="menu-edit-case-context-button"]').click();
      cy.get('[data-testid="case-status-select"]').select('CAV');
      cy.get('[data-testid="associated-judge-select"]').select('Colvin');
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.login('judgecolvin');
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="activity-report-link"]').click();
      cy.get('[data-testid="submitted-and-cav-tab"]').click();
      cy.get(`[data-testid="${docketNumber}"]`).should('be.visible');
    });
  });

  it('create a Submitted - Rule 122 case and verify it shows up in the Submitted/CAV table', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.login('docketclerk');
      searchByDocketNumberInHeader(docketNumber);

      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="menu-edit-case-context-button"]').click();
      cy.get('[data-testid="case-status-select"]').select(
        'Submitted - Rule 122',
      );
      cy.get('[data-testid="associated-judge-select"]').select('Colvin');
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.login('judgecolvin');
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="activity-report-link"]').click();
      cy.get('[data-testid="submitted-and-cav-tab"]').click();
      cy.get(`[data-testid="${docketNumber}"]`).should('be.visible');
    });
  });

  it('should not display a served decision type event code on the submitted and cav table', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.login('docketclerk');
      searchByDocketNumberInHeader(docketNumber);
      updateCaseStatus('Submitted', 'Colvin');

      cy.login('docketclerk');
      searchByDocketNumberInHeader(docketNumber);

      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-create-order"]').click();
      cy.get('[data-testid="event-code-select"]').select('OAD');
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('.ql-editor').click();
      cy.get('[data-testid="save-order-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
      cy.get('[data-testid="success-alert"]');

      cy.login('judgecolvin');
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="activity-report-link"]').click();
      cy.get('[data-testid="submitted-and-cav-tab"]').click();
      cy.get(`[data-testid="${docketNumber}"]`).should('be.visible');

      cy.login('docketclerk');
      searchByDocketNumberInHeader(docketNumber);

      cy.get('[data-testid="tab-drafts"]').click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
      cy.get('[data-testid="judge-select"]').select('Colvin');
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="print-paper-service-done-button"]').click();

      cy.login('judgecolvin');
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="activity-report-link"]').click();
      cy.get('[data-testid="submitted-and-cav-tab"]').click();
      cy.get(`[data-testid="${docketNumber}"]`).should('not.exist');
    });
  });

  it('should display a stricken decision type documents on the submitted and cav table', () => {
    // TODO: we need to actually implement this test
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.login('docketclerk');
      searchByDocketNumberInHeader(docketNumber);
      updateCaseStatus('Submitted', 'Colvin');

      cy.login('docketclerk');
      searchByDocketNumberInHeader(docketNumber);

      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-create-order"]').click();
      cy.get('[data-testid="event-code-select"]').select('OAD');
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('.ql-editor').click();
      cy.get('[data-testid="save-order-button"]').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();
      cy.get('[data-testid="success-alert"]');

      cy.login('judgecolvin');
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="activity-report-link"]').click();
      cy.get('[data-testid="submitted-and-cav-tab"]').click();
      cy.get(`[data-testid="${docketNumber}"]`).should('be.visible');

      cy.login('docketclerk');
      searchByDocketNumberInHeader(docketNumber);

      cy.get('[data-testid="tab-drafts"]').click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
      cy.get('[data-testid="judge-select"]').select('Colvin');
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="print-paper-service-done-button"]').click();

      cy.login('judgecolvin');
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="activity-report-link"]').click();
      cy.get('[data-testid="submitted-and-cav-tab"]').click();
      cy.get(`[data-testid="${docketNumber}"]`).should('not.exist');
    });
  });
});
