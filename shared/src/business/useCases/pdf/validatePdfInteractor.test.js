const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const { validatePdf } = require('./validatePdfInteractor');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

function testAsset(name) {
  return fs.readFileSync(testAssetsPath + name);
}

describe('validatePdf', () => {
  it('validates a clean PDF', async () => {
    const validParams = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getStorageClient: () => ({
          getObject: sinon.stub().returns({
            promise: async () => ({
              Body: testAsset('sample.pdf'),
            }),
          }),
          putObjectTagging: () => {},
        }),
        logger: {
          time: () => null,
          timeEnd: () => null,
        },
      },
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };
    const result = await validatePdf(validParams);
    expect(result).toBeTruthy();
  });

  it('validates an invalid PDF', async () => {
    const invalidParams = {
      applicationContext: {
        environment: { documentsBucketName: 'documents' },
        getStorageClient: () => ({
          getObject: sinon.stub().returns({
            promise: async () => ({
              Body: testAsset('not-a-pdf.pdf'),
            }),
          }),
          putObjectTagging: () => {},
        }),
        logger: {
          time: () => null,
          timeEnd: () => null,
        },
      },
      documentId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    };

    await expect(validatePdf(invalidParams)).rejects.toThrow();
  });
});
