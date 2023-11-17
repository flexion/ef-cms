describe('Work item assignment', () => {
  it('petitionsClerk assigns a work item to themselves, docketClerk should NOT see that work item as unassigned', () => {
    cy.login('petitionsclerk', '/document-qc/section/inbox');
    cy.getByTestId('work-item-102-20')
      .find('[data-testid="checkbox-assign-work-item"]')
      .click();
    cy.getByTestId('dropdown-select-assignee').select('Test Petitionsclerk');
    cy.getByTestId('work-item-102-20')
      .find('[data-testid="table-column-work-item-assigned-to"]')
      .should('contain', 'Test Petitionsclerk');

    cy.login('docketclerk', '/document-qc/section/inbox');
    cy.getByTestId('checkbox-select-all-workitems').click();
    cy.get('.message-select-control input:checked').then(elm => {
      cy.get('.assign-work-item-count-docket').should(
        'contain',
        elm.length - 1,
      );
    });
    cy.getByTestId('dropdown-select-assignee').select('Unassigned');
    cy.get('.message-select-control input:checked').should('have.length', 0);
  });
});
