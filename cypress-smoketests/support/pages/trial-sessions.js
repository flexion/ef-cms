const faker = require('faker');

faker.seed(faker.random.number());

exports.createTrialSession = testData => {
  const createFutureDate = () => {
    const month = faker.random.number({ max: 12, min: 1 });
    const day = faker.random.number({ max: 28, min: 1 });
    const year =
      new Date().getUTCFullYear() + faker.random.number({ max: 5, min: 1 });
    return `${month}/${day}/${year}`;
  };

  cy.get('a[href="/trial-sessions"]').click();
  cy.get('a[href="/add-a-trial-session"]').click();

  // session information
  cy.get('#start-date-date').type(createFutureDate());
  cy.get('#start-time-hours')
    .clear()
    .type(faker.random.number({ max: 11, min: 6 }));
  cy.get('#start-time-minutes')
    .clear()
    .type(faker.random.arrayElement(['00', '15', '30', '45']));
  cy.get('label[for="startTimeExtension-pm"]').click();
  cy.get('label[for="session-type-Hybrid"]').click();
  cy.get('#max-cases').type(faker.random.number({ max: 100, min: 10 }));

  // location information
  cy.get('#trial-location').select(testData.preferredTrialCity);
  cy.get('#courthouse-name').type(faker.commerce.productName());
  cy.get('#address1').type(faker.address.streetAddress());
  cy.get('#city').type(faker.address.city());
  cy.get('#state').select(faker.address.stateAbbr());
  cy.get('#postal-code').type(faker.address.zipCode());

  // session assignments
  cy.get('#judgeId').select('Chief Judge Foley');
  cy.get('#trial-clerk').select('Test trialclerk1');
  cy.get('#court-reporter').type(faker.name.findName());
  cy.get('#irs-calendar-administrator').type(faker.name.findName());
  cy.get('#notes').type(faker.company.catchPhrase());

  cy.get('#submit-trial-session').click();

  // set up listener for POST call, get trialSessionId
  cy.wait('@postTrialSession').then(xhr => {
    const { trialSessionId } = xhr.response.body;
    testData.trialSessionIds.push(trialSessionId);
    cy.get('#new-trial-sessions-tab').click();
    cy.get(`a[href="/trial-session-detail/${trialSessionId}"]`).should('exist');
  });
};

exports.goToTrialSession = trialSessionId => {
  cy.goToRoute(`/trial-session-detail/${trialSessionId}`);
};

exports.setTrialSessionAsCalendared = trialSessionId => {
  cy.goToRoute(`/trial-session-detail/${trialSessionId}`);
  cy.get('#set-calendar-button').should('exist').click();
  cy.get('#modal-root .modal-button-confirm').click();
  cy.get('#set-calendar-button').should('not.exist');
};

exports.markCaseAsQcCompleteForTrial = docketNumber => {
  cy.get(`#upcoming-sessions label[for="${docketNumber}-complete"]`).click();
};

exports.verifyOpenCaseOnTrialSession = docketNumber => {
  cy.get(
    `#open-cases-tab-content a[href="/case-detail/${docketNumber}"]`,
  ).should('exist');
};
