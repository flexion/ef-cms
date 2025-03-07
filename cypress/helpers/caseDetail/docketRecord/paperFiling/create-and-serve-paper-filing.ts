import { fillPaperFilingForm } from './fill-paper-filing-form';

export function createAndServePaperFiling({
  dateReceived,
  documentType,
  isPaperCase = true,
  freeText,
}: {
  documentType: string;
  dateReceived: string;
  isPaperCase?: boolean;
  freeText?: string;
}): Cypress.Chainable<{ docketEntryId: string }> {
  fillPaperFilingForm({ dateReceived, documentType, freeText });

  cy.get('[data-testid="save-and-serve"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
  if (isPaperCase) {
    cy.get('[data-testid="print-paper-service-done-button"]').click();
  }
  cy.get('[data-testid="success-alert"]');

  return cy
    .url()
    .should('include', 'docketEntryId')
    .then(url => {
      const urlParams = new URLSearchParams(new URL(url).search);
      const docketEntryId = urlParams.get('docketEntryId');
      if (!docketEntryId) {
        throw new Error('Unable to get docketEntryId from URL');
      }
      return cy.wrap({ docketEntryId });
    });
}
