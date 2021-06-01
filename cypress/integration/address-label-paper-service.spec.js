const {
  getAddress1InputField,
  getCaseDetailTab,
  getEditPetitionerButton,
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
    // go to the Notice of Change of address on the docket record
    // qc complete
  });

  it('should display the address label on print', () => {
    //view the address label page prepended to the docket entry pdf
    getSnapshot('');
  });
});
