const {
  createOrder,
  getSnapshot,
  hoverOverSignatureWarning,
  navigateTo: navigateToCaseDetail,
  signDocumentAtCanvasCenter,
} = require('../support/pages/case-detail');

describe('Sign order', function () {
  before(() => {
    navigateToCaseDetail('docketclerk', '101-19');
    createOrder('101-19');
  });

  it('should display the signature warning banner on hover', () => {
    hoverOverSignatureWarning().should('have.css', 'color', 'rgba(0, 0, 0, 0)');
  });

  it("should place the signature to the top right of the point that's clicked", () => {
    signDocumentAtCanvasCenter();
    getSnapshot('#sign-pdf-canvas');
  });
});
