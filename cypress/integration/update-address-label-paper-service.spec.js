const {
  createOrder,
  getSnapshot,
  hoverOverSignatureWarning,
  navigateTo: navigateToCaseDetail,
  signDocumentAtCanvasCenter,
} = require('../support/pages/case-detail');

describe('Update Address Label on Paper Service', function () {
  before(() => {
    navigateToCaseDetail('docketclerk', '124-20');
    createOrder('101-19');
  });

  it('should display the signature warning banner on hover', () => {
    hoverOverSignatureWarning().should('have.css', 'color', 'rgb(0, 0, 0)');
  });

  it("should place the signature to the top right of the point that's clicked", () => {
    signDocumentAtCanvasCenter();
    getSnapshot('#sign-pdf-canvas');
  });

  // TODO - test for update-address-label-paper-service
  // go to a paper case
  // edit a petitioner's address
  // go to the Notice of Change of address on the docket record
  // qc complete
  // view the address label page prepended to the docket entry pdf
  // should look correct
});
