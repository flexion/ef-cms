const {
  getAddress1InputField,
  getButton,
  getCaseDetailTab,
  getCompleteQcButton,
  getEditPetitionerButton,
  getLink,
  getPrintPaperServiceConfirmationButton,
  getSnapshot,
  getSubmitEditPetitionerButton,
  navigateTo: navigateToCaseDetail,
} = require('../support/pages/case-detail');

describe('Address Label on Paper Service', function () {
  before(() => {
    navigateToCaseDetail('docketclerk', '124-20');
    getCaseDetailTab('case-information').click();
    getCaseDetailTab('parties').click();
    getEditPetitionerButton().click();
    getAddress1InputField().clear().type('123 Bubblegum Lane');
    getSubmitEditPetitionerButton().click();
    getCaseDetailTab('docket-record').click();
    getButton('Notice of Change of Address for Stacy Russold').click();
    getLink('Complete QC').click();
    getCompleteQcButton().click();
    getPrintPaperServiceConfirmationButton().click();
    // go to the Notice of Change of address on the docket record
    // qc complete
  });

  it('should display the address label on print', () => {
    //view the address label page prepended to the docket entry pdf
    getSnapshot('#pdf-preview-iframe');
  });
});
