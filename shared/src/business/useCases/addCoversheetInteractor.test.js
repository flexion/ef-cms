const { addCoversheetInteractor } = require('./addCoversheetInteractor.js');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('addCoversheetInteractor', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  it('throws an auth exception when user has the wrong role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'admin',
    });

    let error;
    try {
      await addCoversheetInteractor({
        applicationContext,
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('Unauthorized');
  });

  it('throws an error if document already has a coversheet', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'petitioner',
    });
    applicationContext.getPersistenceGateway().getCaseByCaseId.mockReturnValue({
      documents: [
        {
          documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          processingStatus: 'complete',
        },
      ],
    });

    let error;
    try {
      await addCoversheetInteractor({
        applicationContext,
        caseId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('cover sheet is already added to document');
  });
});
