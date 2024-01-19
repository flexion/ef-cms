import { fillInCreateCaseFromPaperForm } from '../support/pages/create-paper-petition';
import {
  getCreateACaseButton,
  navigateTo as navigateToDocumentQC,
} from '../support/pages/document-qc';
import { unchecksOrdersAndNoticesBoxesInCase } from '../support/pages/unchecks-orders-and-notices-boxes-in-case';

describe('Create case and submit to IRS', function () {
  it('should display parties tab when user navigates to create a case', () => {
    navigateToDocumentQC('petitionsclerk');

    getCreateACaseButton().click();
    cy.get('#tab-parties').parent().should('have.attr', 'aria-selected');

    fillInCreateCaseFromPaperForm();

    cy.intercept('POST', '**/paper').as('postPaperCase');
    cy.get('#submit-case').click();

    cy.wait('@postPaperCase').then(({ response }) => {
      expect(response.body).to.have.property('docketNumber');
    });
    // /* ==== Generated with Cypress Studio ==== */
    // cy.get(':nth-child(3) > .grid-row > .grid-col > .pdf-preview-btn').should('be.visible');
    // cy.get(':nth-child(3) > .grid-row > .grid-col > .pdf-preview-btn').click();
    // cy.get('[data-testid="close-modal-button"]').click();
    // /* ==== End Cypress Studio ==== */
  });

  it('should display attachment links in the attachment section', () => {
    cy.get('[data-testid="attachmentToPetitionFileButton"]').should(
      'be.visible',
    );
  });

  it.skip('should display Orders/Notices Automatically Created notification', () => {
    cy.get('#orders-notices-needed-header').should('exist');
    cy.get('#orders-notices-auto-created-in-draft').should('exist');
  });

  it.skip('should uncheck the previously selected Notices/Orders needed in Case Info Tab', () => {
    cy.get('#case-information-edit-button').click();
    unchecksOrdersAndNoticesBoxesInCase();

    cy.intercept('PUT', '**/cases/**').as('submitCase');
    cy.get('#submit-case').click();
    cy.wait('@submitCase').then(() => {
      cy.get('#orders-notices-needed-header').should('not.exist');
      cy.get('#orders-notices-auto-created-in-draft').should('not.exist');
    });
  });

  it.skip('should display a confirmation modal when the user clicks cancel on the review page', () => {
    cy.get('button#cancel-create-case').scrollIntoView().click();
    cy.get('div.modal-header').should('exist');
  });

  it.skip('should route to Document QC inbox when the user confirms to cancel', () => {
    cy.get('button.modal-button-confirm').scrollIntoView().click();
    cy.url().should('include', 'document-qc/my/inbox');
  });
});
