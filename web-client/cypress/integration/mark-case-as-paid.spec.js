xdescribe('Mark a Case as Paid', function() {
  describe('Docketclerk logs', () => {
    before(() => {
      cy.login('docketclerk', '/case-detail/102-19');
    });

    it('click on the case info tab', () => {
      cy.get('#case-info-tab').click();
    });

    it('click on the paid radio button', () => {
      cy.get('#paygov + label')
        .scrollIntoView()
        .click();
    });

    it('type in a paid gov id', () => {
      cy.get('#paygovid')
        .scrollIntoView()
        .type('abc123');
    });

    it('submit the update', () => {
      cy.get('#update-case-page-end')
        .scrollIntoView()
        .click();
    });

    it('verify the green alert comes up', () => {
      cy.get('.usa-alert-success').should('exist');
    });

    // TODO: revive this later
    xit('verify the paygov p tag has the updated info', () => {
      cy.get('#pay-gov-id-display')
        .scrollIntoView()
        .should('contain', 'abc123');
    });
  });
});
