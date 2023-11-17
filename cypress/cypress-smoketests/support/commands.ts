import 'cypress-file-upload';
import { getEnvironmentSpecificFunctions } from './environment-specific-factory';

const { login } = getEnvironmentSpecificFunctions();

Cypress.Commands.add('login', (username, route = '/') => {
  login(`${username}@example.com`, route);
  cy.window().then(win =>
    win.localStorage.setItem('__cypressOrderInSameTab', 'true'),
  );
});
