const axios = require('axios');

export const userNavigatesToCreateCaseConfirmation = integrationTest => {
  it('user sees the case confirmation pdf', async () => {
    await integrationTest.runSequence('gotoPrintableCaseConfirmationSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const pdfPreviewUrl = integrationTest.getState('pdfPreviewUrl');
    expect(pdfPreviewUrl).not.toBeNull();

    await axios.get(pdfPreviewUrl);
  });
};
