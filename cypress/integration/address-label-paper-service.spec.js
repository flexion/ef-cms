const faker = require('faker');
const {
  getAddress1InputField,
  getCaseDetailTab,
  getCompleteQcButton,
  getEditPetitionerButton,
  getIframeBody,
  getLink,
  getNonQCDocketRecord,
  getPrintPaperServiceConfirmationButton,
  getSnapshot,
  getSubmitEditPetitionerButton,
  navigateTo: navigateToCaseDetail,
} = require('../support/pages/case-detail');

// todo potentially: go to localhost of print NCA and snapshot there

describe('Address Label on Paper Service', function () {
  before(() => {
    navigateToCaseDetail('docketclerk', '124-20');
  });

  it('should edit petitioner address1 field', () => {
    getCaseDetailTab('case-information').click();
    getCaseDetailTab('parties').click();

    getEditPetitionerButton().click();
    getAddress1InputField().clear().type(faker.address.streetAddress());
    getSubmitEditPetitionerButton().click();
  });

  it('should complete QC on Notice of Change of Address', () => {
    getCaseDetailTab('docket-record').click();
    const nonQCDocketRecord = getNonQCDocketRecord();
    nonQCDocketRecord
      .contains('Notice of Change of Address for Stacy Russold')
      .click();

    getLink('Complete QC').click();
    getCompleteQcButton().click();
  });

  it('should display the address label on print preview for paper service', () => {
    getPrintPaperServiceConfirmationButton().click();
    // grab the pdf preview iframe's src (getAttribute?)
    // navigate to that url
    getIframeBody().find('AddressLabelCoverSheet').scrollIntoView();
    // getSnapshot('.address-label');

    // getSnapshot('.print-docket-record');
  });
});
