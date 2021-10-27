const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { uploadDocumentFromClient } = require('./uploadDocumentFromClient');

describe('uploadDocument', () => {
  const KEY = 'abc';
  beforeAll(() => {
    applicationContext.getUniqueId.mockReturnValue(KEY);
    applicationContext
      .getPersistenceGateway()
      .uploadPdfFromClient.mockReturnValue(KEY);
  });

  it('returns the expected key after the upload was successful', async () => {
    const key = await uploadDocumentFromClient({
      applicationContext,
    });

    expect(key).toEqual(KEY);
  });

  it('returns the provided key after the upload was successful', async () => {
    const diffKey = 'different-key';

    const key = await uploadDocumentFromClient({
      applicationContext,
      key: diffKey,
    });

    expect(applicationContext.getUniqueId).not.toHaveBeenCalled();
    expect(key).toEqual(diffKey);
  });
});
