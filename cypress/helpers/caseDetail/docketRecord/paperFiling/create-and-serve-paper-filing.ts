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
}) {
  fillPaperFilingForm({ dateReceived, documentType, freeText });

  cy.get('[data-testid="save-and-serve"]').click();
  cy.get('[data-testid="modal-button-confirm"]').click();
  if (isPaperCase)
    cy.get('[data-testid="print-paper-service-done-button"]').click();
}
