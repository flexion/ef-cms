import {
  loginAsDocketClerk,
  loginAsPetitioner,
  loginAsPetitionsClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Work item assignment', () => {
  it('petitionsClerk assigns a work item to themselves, docketClerk should NOT see that work item as unassigned', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCase().then(docketNumber => {
      loginAsPetitionsClerk();
      cy.visit('/document-qc/section/inbox');
      cy.get(`[data-testid="work-item-${docketNumber}"]`)
        .find('[data-testid="checkbox-assign-work-item"]')
        .click();
      cy.get('[data-testid="dropdown-select-assignee"]').select(
        'Test Petitionsclerk',
      );
      loginAsPetitionsClerk();
      cy.visit('/document-qc/section/inbox');
      cy.get(
        `[data-testid="work-item-${docketNumber}"] [data-testid="table-column-work-item-assigned-to"]:contains("Test Petitionsclerk")`,
      ).should('have.length.above', 0);
      loginAsDocketClerk();
      cy.visit('/document-qc/section/inbox');
      cy.get('[data-testid="checkbox-select-all-workitems"]').click();
      cy.get('[data-testid="select-work-item"]:checked').then(elm => {
        cy.get('[data-testid="select-work-item"]').should(
          'have.length',
          elm.length,
        );
      });
      cy.get('[data-testid="dropdown-filter-assignee"]').select('Unassigned');
      cy.get('[data-testid="select-work-item"]:checked').should(
        'have.length',
        0,
      );
    });
  });
});
