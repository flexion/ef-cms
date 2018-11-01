describe('Log in page', function() {
  before(() => {
    cy.visit('/login');
  });

  it('finds all the elements', () => {
    cy.get('form#login').should('exist');
    cy.get('form#login #name').should('exist');
    cy.get('form#login input[type="submit"]').should('exist');
  });

  it('fails login', () => {
    cy.get('form#login #name').type('Bad Actor');
    cy.get('form#login input[type="submit"]').click();
    cy.get('.usa-alert-error').should('contain', 'User not found');
    cy.url().should('include', 'login');
  });

  it('logs in successfully', () => {
    cy.get('form#login #name')
      .clear()
      .type('Test, Taxpayer');
    cy.get('form#login input[type="submit"]').click();
    cy.url().should('not.include', 'login');
    cy.get('header').should('contain', 'Hello, Test, Taxpayer');
  });
});
