import { PDF } from '../../../../../shared/src/business/entities/documents/PDF';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { uploadOrderFileAction } from './uploadOrderFileAction';

describe('uploadOrderFileAction', () => {
  const errorStub: jest.Mock = jest.fn();
  const successStub: jest.Mock = jest.fn();

  const file: Blob = new Blob(['abc']);
  const pdf: PDF = new PDF(file);
  const mockPrimaryDocumentFileId: string =
    '2729c8a9-45a5-47ff-9210-01bf0fc3a133';

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: errorStub,
    success: successStub,
  };

  it('should call path.error when an error occurs while uploading the order document', async () => {
    await applicationContext
      .getUseCases()
      .uploadOrderDocumentInteractor.mockRejectedValueOnce(new Error());

    await runAction(uploadOrderFileAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          primaryDocumentFile: pdf,
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
  });

  it('should call uploadOrderDocumentInteractor', async () => {
    await runAction(uploadOrderFileAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          primaryDocumentFile: pdf,
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadOrderDocumentInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().uploadOrderDocumentInteractor.mock
        .calls[0][1].documentFile,
    ).toBe(pdf.file);
  });

  it('should call path.success with the returned primaryDocumentFileId after successfully uploading the order document', async () => {
    applicationContext
      .getUseCases()
      .uploadOrderDocumentInteractor.mockReturnValue(mockPrimaryDocumentFileId);

    await runAction(uploadOrderFileAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          primaryDocumentFile: pdf,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(successStub.mock.calls[0][0]).toMatchObject({
      primaryDocumentFileId: mockPrimaryDocumentFileId,
    });
  });
});
