import { createOrder } from 'cypress/helpers/caseDetail/docketRecord/courtIssuedFiling/create-order-and-decision';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { navigateToDashboard } from 'cypress/local-only/support/pages/maintenance';
import {
  searchForOrderByJudge,
  searchForDocuments,
} from 'cypress/local-only/support/pages/public/advanced-search';

describe('Order Search', () => {
  it('should be able to search for an order by legacy judge', () => {
    const judgeNameColumnIndex = 5;
    const wantedLegacyJudge = 'Fieri';

    navigateToDashboard();
    cy.get('[data-testid="order-search-tab"]').click();
    searchForOrderByJudge(wantedLegacyJudge);
    searchForDocuments();

    cy.get('table.search-results');

    //assert that every judge in the search result list is the wanted legacy judge
    cy.get('tr.search-result').each(element => {
      cy.wrap(element).within(() => {
        cy.get('td')
          .eq(judgeNameColumnIndex)
          .should('have.text', wantedLegacyJudge);
      });
    });
  });

  it.only('should do lots of stuff', () => {
    createAndServePaperPetition().then(({ docketNumber: _2 }) => {
      // Docket clerk creates a draft order (should not be viewable to the public)
      createOrder().then(({ docketEntryId: _1 }) => {});
    });
    // Docket clerk creates and serves an order (should be viewable to the public)
    // Docket clerk creates and serves a motion (should be viewable to the public)
    // Docket clerk creates a transcript but does not serve it (transcripts are unservable, should not be viewable to the public)
    // Docket clerk creates and serves a Stipulated Decision (should not be viewable to the public)
  });
});
