export const getStartCaseButton = () => {
  return cy.get('a#file-a-petition');
};

export const getCaseList = () => {
  return cy.get('#case-list tbody tr');
};
