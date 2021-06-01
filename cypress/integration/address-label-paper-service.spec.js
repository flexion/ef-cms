const faker = require('faker');
const {
  getAddress1InputField,
  getCaseDetailTab,
  getCompleteQcButton,
  getEditPetitionerButton,
  getLink,
  getNonQCDocketRecord,
  getPdfPreviewUrl,
  getPrintPaperServiceConfirmationButton,
  getSnapshot,
  getSubmitEditPetitionerButton,
  navigateTo: navigateToCaseDetail,
} = require('../support/pages/case-detail');

// todo: break out into more readable tests
// potentially: go to localhost of print NCA and snapshot there

describe('Address Label on Paper Service', function () {
  before(() => {
    navigateToCaseDetail('docketclerk', '124-20');
    getCaseDetailTab('case-information').click();
    getCaseDetailTab('parties').click();
    getEditPetitionerButton().click();
    getAddress1InputField().clear().type(faker.address.streetAddress());
    getSubmitEditPetitionerButton().click();
    getCaseDetailTab('docket-record').click();
    const nonQCDocketRecord = getNonQCDocketRecord();
    nonQCDocketRecord
      .contains('Notice of Change of Address for Stacy Russold')
      .click();
    getLink('Complete QC').click();
    getCompleteQcButton().click();
    getPrintPaperServiceConfirmationButton().click();
  });

  it('should display the address label on print', () => {
    // grab the pdf preview iframe's src (getAttribute?)
    // navigate to that url
    getPdfPreviewUrl();
    getSnapshot('#pdf-preview-iframe');
  });
});
