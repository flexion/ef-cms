import { loginAsDocketClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import {
  addOrderToDocketEntry,
  createOrder,
} from 'cypress/helpers/caseDetail/docketRecord/courtIssuedFiling/create-order-and-decision';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';
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
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      // Docket clerk creates a draft order (should not be viewable to the public)
      createOrder({ title: 'This is a draft order' }).then(
        ({ docketEntryId: draftDocketEntryId }) => {
          // Docket clerk creates and serves an order (should be viewable to the public)
          createOrder({ title: 'This is a served order' }).then(
            ({ docketEntryId: servedDocketEntryId }) => {
              cy.get(
                `[data-testid=draft-document-id-${servedDocketEntryId}]`,
              ).click();
              addOrderToDocketEntry();
              cy.get('[data-testid=print-paper-service-done-button]').click();

              // Docket clerk creates and serves a motion (should be viewable to the public)
              createAndServePaperFiling({
                isPaperCase: true,
                documentType: 'M000',
                dateReceived: '03/03/2022',
                freeText: 'This motion is for a test',
              }).then(({ docketEntryId: motionDocketEntryId }) => {
                // Docket clerk creates a transcript but does not serve it (transcripts are unservable, should not be viewable to the public)
                createOrder({ title: 'This will turn into a Transcript' }).then(
                  ({ docketEntryId: transcriptDocketEntryId }) => {
                    cy.get(
                      '[data-testid=add-court-issued-docket-entry-button]',
                    ).click();
                    selectTypeaheadInput(
                      'court-issued-document-type-search',
                      'Revised Transcript',
                    );
                    cy.get('#date-received-picker').type('03/07/2025');
                    cy.get('#date-picker').type('03/01/2025');
                    cy.get('[data-testid="save-docket-entry-button"]').click();
                    cy.get('[data-testid="success-alert"]').contains(
                      'Your entry has been added to the docket record',
                    );

                    //Docket clerk creates and serves a Stipulated Decision (should be viewable to the public)
                    createOrder({
                      title: 'This will turn into a Stipulated Decision',
                    }).then(({ docketEntryId: stipDocketEntryId }) => {
                      cy.get(
                        '[data-testid=add-court-issued-docket-entry-button]',
                      ).click();
                      selectTypeaheadInput(
                        'court-issued-document-type-search',
                        'Stipulated Decision',
                      );
                      cy.get('[data-testid="judge-select"]').select('Colvin');
                      cy.get('[data-testid="serve-to-parties-btn"]').click();
                      cy.get('[data-testid="modal-button-confirm"]').click();
                      cy.get(
                        '[data-testid=print-paper-service-done-button]',
                      ).click();
                      cy.get('[data-testid="success-alert"]').contains(
                        'Document served',
                      );

                      cy.visit('/');
                      cy.get('[data-testid=docket-number]').type(docketNumber);
                      cy.get('[data-testid=docket-search-button]').click();
                      cy.get('[data-testid=header-public-case-detail]');

                      cy.get(
                        `[data-cy=public-docket-entry-id-${draftDocketEntryId}]`,
                      ).should('not.exist');
                      cy.get(
                        `[data-cy=public-docket-entry-id-${servedDocketEntryId}]`,
                      ).should('exist');
                      cy.get(
                        `[data-cy=public-docket-entry-id-${motionDocketEntryId}]`,
                      ).should('exist');
                      cy.get(
                        `[data-cy=public-docket-entry-id-${transcriptDocketEntryId}]`,
                      ).should('not.exist');
                      cy.get(
                        `[data-cy=public-docket-entry-id-${stipDocketEntryId}]`,
                      ).should('exist');
                    });
                  },
                );
              });
            },
          );
        },
      );
    });
  });
});
