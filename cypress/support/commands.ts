import '../support/commands/keepAliases';
import 'cypress-file-upload';

before(() => {
  // Skip subsequent tests in spec when one fails.
  (cy.state('runnable').ctx as Mocha.Context).currentTest?.parent?.bail(true);

  cy.intercept('*', req => {
    req.headers['x-test-user'] = 'true';
  });
});

beforeEach(() => {
  cy.intercept('*', req => {
    req.headers['x-test-user'] = 'true';
  });
});
