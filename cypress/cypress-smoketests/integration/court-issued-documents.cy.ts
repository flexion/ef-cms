import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { loginAsPetitionsClerk } from '../../helpers/auth/login-as-helpers';

describe('Court Issued Documents', { scrollBehavior: 'center' }, () => {
  it('should create a paper petition, serve the petition, and create an order on the petition', () => {
    loginAsPetitionsClerk();
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.login('docketclerk1');
      cy.get('[data-testid="inbox-tab-content"]').should('exist');
      cy.get('#search-field').clear();
      cy.get('#search-field').type(docketNumber);
      cy.get('[data-testid="search-docket-number"]').click();
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('#menu-button-create-order').click();
      cy.get('#eventCode').select('O');
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('.ql-editor').click();
      cy.get('#save-order-button').click();
      cy.get('#sign-pdf-canvas').click();
      cy.get('#save-signature-button').click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
      cy.get(':nth-child(2) > .usa-radio__label').click();
      cy.get('#service-stamp-0').check();
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="print-paper-service-done-button"]').click();
      cy.get('[data-testid="document-viewer-link-O"]').should(
        'have.text',
        'Order',
      );
    });
  });
});
