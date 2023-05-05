import { applicationContext } from '../../test/createTestApplicationContext';
import { removePdf, validatePdfInteractor } from './validatePdfInteractor';
import { testInvalidPdfDoc, testPdfDoc } from '../../test/getFakeFile';

describe('validatePdfInteractor', () => {
  const getPagesMock = jest.fn();

  beforeEach(() => {
    applicationContext.getPdfLib = jest.fn().mockReturnValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({
          getPages: getPagesMock,
          isEncrypted: false,
        }),
      },
    });

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

    applicationContext.getPersistenceGateway().deleteDocumentFile = jest.fn();
  });

  it('should NOT throw an error and return when the PDF provided is valid', async () => {
    await expect(
      validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).resolves.not.toBeDefined();
  });

  it('should throw an error and delete the document from S3 when the PDF is encrypted', async () => {
    applicationContext.getPdfLib = jest.fn().mockReturnValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({
          isEncrypted: true,
        }),
      },
    });

    await expect(
      validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('invalid pdf');

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile,
    ).toHaveBeenCalledWith({
      applicationContext,
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
  });

  it('should throw an error and delete the document from S3 when the document is NOT of type PDF', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testInvalidPdfDoc,
      }),
    });

    await expect(
      validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('invalid pdf');

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile,
    ).toHaveBeenCalledWith({
      applicationContext,
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
  });

  it('should throw an error and delete the document from S3 when pdf pages cannot be read', async () => {
    getPagesMock.mockImplementation(() => {
      throw new Error('cannot read pages');
    });

    await expect(
      validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('pdf pages cannot be read');

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile,
    ).toHaveBeenCalledWith({
      applicationContext,
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
  });

  describe('removePdf', () => {
    it('should delete a document from S3 based on the given key', () => {
      removePdf({
        applicationContext,
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        message: 'Test!',
      });

      expect(
        applicationContext.getPersistenceGateway().deleteDocumentFile,
      ).toHaveBeenCalledWith({
        applicationContext,
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
    });

    it('should log to the debug stream the given key and error message for context', () => {
      removePdf({
        applicationContext,
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        message: 'Test Message',
      });

      expect(applicationContext.logger.debug.mock.calls[0][0]).toEqual(
        'Test Message: Deleting from S3',
      );
      expect(applicationContext.logger.debug.mock.calls[0][1]).toEqual(
        'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
    });

    it('should log to the debug stream with a generic message when one is not given', () => {
      removePdf({
        applicationContext,
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });

      expect(applicationContext.logger.debug.mock.calls[0][0]).toEqual(
        'PDF Error: Deleting from S3',
      );
      expect(applicationContext.logger.debug.mock.calls[0][1]).toEqual(
        'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
    });
  });
});
