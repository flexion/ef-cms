import { PDF } from '../../../../../shared/src/business/entities/documents/PDF';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { uploadDocketEntryFileAction } from './uploadDocketEntryFileAction';

describe('uploadDocketEntryFileAction', () => {
  const mockDocketEntryId: string = '7dc7c871-6fc4-4274-85ed-63b0c14465bd';

  const file: Blob = new Blob(['abc']);
  const pdf: PDF = new PDF(file);

  const successStub: jest.Mock = jest.fn();
  const errorStub: jest.Mock = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: errorStub,
    success: successStub,
  };

  it('should make a call to upload the selected document with docketEntryId from state', async () => {
    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: pdf,
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadDocumentInteractor.mock.calls[0][1]
        .key,
    ).toBe(mockDocketEntryId);
    expect(
      applicationContext.getUseCases().uploadDocumentInteractor.mock.calls[0][1]
        .documentFile,
    ).toBe(pdf.file);
  });

  it('should return the error path when an error is thrown while attempting to upload the document file', async () => {
    applicationContext
      .getUseCases()
      .uploadDocumentInteractor.mockRejectedValueOnce(new Error('whoopsie!'));

    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      state: {
        form: {
          primaryDocumentFile: pdf,
        },
      },
    });

    expect(errorStub).toHaveBeenCalled();
  });

  it('should return the success path with the docketEntryId when the document was uploaded successfully', async () => {
    await applicationContext
      .getUseCases()
      .uploadDocumentInteractor.mockReturnValue(mockDocketEntryId);

    await runAction(uploadDocketEntryFileAction, {
      modules: { presenter },
      state: {
        docketEntryId: mockDocketEntryId,
        form: {
          primaryDocumentFile: pdf,
        },
      },
    });

    expect(successStub).toHaveBeenCalled();
    expect(successStub.mock.calls[0][0]).toMatchObject({
      docketEntryId: mockDocketEntryId,
    });
  });
});
