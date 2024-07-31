import { getCypressEnv } from '../env/cypressEnvironment';

export function loginAsTestAdmissionsClerk() {
  cyLogin({ email: 'testAdmissionsClerk@example.com' });
  cy.get('#inbox-tab-content').should('exist');
}

export function loginAsAdc(user: 'adc@example.com' = 'adc@example.com') {
  cyLogin({ email: user });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsAdmissionsClerk(
  user:
    | 'testAdmissionsClerk@example.com'
    | 'admissionsclerk1@example.com' = 'admissionsclerk1@example.com',
) {
  cyLogin({ email: user });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsDojPractitioner(
  dojPractitionerUser:
    | 'dojPractitioner1@example.com'
    | 'dojPractitioner2@example.com'
    | 'dojPractitioner3@example.com' = 'dojPractitioner1@example.com',
) {
  cyLogin({ email: dojPractitionerUser });
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
}

export function loginAsPrivatePractitioner(
  practitionerUser:
    | 'privatePractitioner1@example.com'
    | 'privatePractitioner2@example.com'
    | 'privatePractitioner3@example.com'
    | 'privatePractitioner4@example.com' = 'privatePractitioner1@example.com',
) {
  cyLogin({ email: practitionerUser });
  cy.get('[data-testid="file-a-petition"]').should('exist');
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
  cy.get('[data-testid="open-cases-count"]').contains('Open Cases');
  cy.get('[data-testid="closed-cases-count"]').contains('Closed Cases');
}

export function loginAsIrsPractitioner(
  irsPractitionerUser:
    | 'irsPractitioner@example.com'
    | 'irsPractitioner1@example.com'
    | 'irsPractitioner2@example.com' = 'irsPractitioner@example.com',
) {
  cyLogin({ email: irsPractitionerUser });
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
  cy.get('[data-testid="open-cases-count"]').contains('Open Cases');
  cy.get('[data-testid="closed-cases-count"]').contains('Closed Cases');
}

export function loginAsIrsPractitioner1() {
  cyLogin({ email: 'irsPractitioner1@example.com' });
  cy.get('[data-testid="search-for-a-case-card"]').should('exist');
  cy.get('[data-testid="open-cases-count"]').contains('Open Cases');
  cy.get('[data-testid="closed-cases-count"]').contains('Closed Cases');
}

export function loginAsPetitioner(
  petitionerUser:
    | 'petitioner@example.com'
    | 'petitioner1@example.com'
    | 'petitioner2@example.com' = 'petitioner1@example.com',
) {
  cyLogin({ email: petitionerUser });
  cy.get('[data-testid="file-a-petition"]').should('exist');
}

export function loginAsCaseServicesSupervisor(
  user:
    | 'caseservicessupervisor@example.com'
    | 'caseServicesSupervisor1@example.com' = 'caseservicessupervisor@example.com',
) {
  cyLogin({ email: user });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsPetitionsClerk() {
  cyLogin({ email: 'petitionsclerk@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsPetitionsClerk1() {
  cyLogin({ email: 'petitionsclerk1@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsDocketClerk() {
  cyLogin({ email: 'docketclerk@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsDocketClerk1() {
  cyLogin({ email: 'docketclerk1@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsFloater() {
  cyLogin({ email: 'floater1@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsGeneral() {
  cyLogin({ email: 'general@example.com' });
  cy.get('[data-testid="section-inbox-tab"]').should('exist');
}

export function loginAsColvin() {
  cyLogin({ email: 'judgecolvin@example.com' });
  cy.get('h1:contains("Trial Sessions")').should('exist');
}

export function loginAsColvinChambers() {
  cyLogin({ email: 'colvinschambers@example.com' });
  cy.get('[data-testid="upcoming-trial-sessions-card"]').should('exist');
}

export function loginAsReportersOffice() {
  cyLogin({ email: 'reportersoffice@example.com' });
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
}

export function loginAsIrsSuperUser() {
  cyLogin({ email: 'irssuperuser@example.com' });
  cy.get('[data-testid="advanced-search-link"]').should('exist');
}

export function cyLogin({ email }: { email: string }) {
  cy.clearAllCookies();
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(
    getCypressEnv().defaultAccountPass,
  );
  cy.get('[data-testid="login-button"]').click();
  cy.window().then(win =>
    win.localStorage.setItem('__cypressOrderInSameTab', 'true'),
  );
}
