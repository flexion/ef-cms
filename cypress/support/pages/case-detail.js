exports.navigateTo = (username, docketNumber) => {
  cy.login(username, `/case-detail/${docketNumber}`);
};

exports.getActionMenuButton = () => {
  return cy.get('button.case-detail-menu__button');
};

exports.getEditCaseCaptionButton = () => {
  return cy.get('button#menu-edit-case-context-button');
};

exports.getCaptionTextArea = () => {
  return cy.get('textarea.caption');
};

exports.getButton = buttonText => {
  return cy.contains('button', buttonText);
};

exports.getNonQCDocketRecord = () => {
  return cy.get('tr.qc-untouched');
};

exports.getLink = linkText => {
  return cy.contains('a', linkText);
};

exports.getCaseTitleContaining = text => {
  return cy.contains('p#case-title', text);
};

exports.getCaseDetailTab = tabName => {
  // tabName can be: docket-record, tracked-items, drafts, correspondence, case-information, case-messages, notes
  return cy.get(`button#tab-${tabName}`);
};

exports.createOrder = docketNumber => {
  cy.goToRoute(
    `/case-detail/${docketNumber}/create-order?documentTitle=Order to Show Cause&documentType=Order to Show Cause&eventCode=OSC`,
  );
  cy.url().should('contain', '/create-order');
  cy.get('.ql-editor').type('A created order!');
  cy.get('#save-order-button').click();
  cy.url().should('contain', '/sign');
};

exports.hoverOverSignatureWarning = () => {
  return cy.get('#signature-warning').realHover();
};

exports.signDocumentAtCanvasCenter = () => {
  return cy.get('#sign-pdf-canvas').click('center');
};

exports.getSnapshot = area => {
  cy.get(area).matchImageSnapshot(area);
};

exports.getEditPetitionerButton = () => {
  return cy.get('a.edit-petitioner-button');
};

exports.getAddress1InputField = () => {
  return cy.get('input[name="contact.address1"]');
};

exports.getSubmitEditPetitionerButton = () => {
  return cy.get('button#submit-edit-petitioner-information');
};

exports.getCompleteQcButton = () => {
  return cy.get('button#save-and-finish');
};

exports.getPrintPaperServiceConfirmationButton = () => {
  return cy.get('button#confirm');
};

const getIframeDocument = () => {
  return cy.get('#pdf-preview-iframe').its('0.contentDocument').should('exist');
};

exports.getIframeBody = () => {
  const woo = getIframeDocument()
    .its('body')
    .should('not.be.undefined')
    .then(cy.wrap);

  cy.get('#pdf-preview-iframe')
    .its('0')
    .then(x => console.log('woo', x));

  return woo;
};

// cy.get('.address-label').scrollIntoView().should('be.visible')
