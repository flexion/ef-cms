exports.goToCreateCase = () => {
  cy.get('a#file-a-petition').click();
  cy.get('.dynamsoft-dialog-close').then($closeButton => {
    $closeButton.click();
  });
};

exports.goToReviewCase = testData => {
  cy.server();
  cy.route('POST', '**/paper').as('postPaperCase');
  cy.get('button#submit-case').scrollIntoView().click();
  cy.wait('@postPaperCase');
  cy.get('@postPaperCase').should(xhr => {
    expect(xhr.responseBody).to.have.property('docketNumber');
    if (testData) {
      testData.createdPaperDocketNumber = xhr.responseBody.docketNumber;
    }
  });
};

exports.saveCaseForLater = () => {
  cy.get('button:contains("Save for Later")').click();
};

exports.serveCaseToIrs = () => {
  cy.get('#ustc-start-a-case-form button#submit-case').scrollIntoView().click();
  cy.get('button#confirm').scrollIntoView().click();
};
