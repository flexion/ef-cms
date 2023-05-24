import { PDF } from '../../../../../shared/src/business/entities/documents/PDF';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateFileAction } from './validateFileAction';

describe('validateFileAction', () => {
  const pathSuccessStub: jest.Mock = jest.fn();
  const pathErrorStub: jest.Mock = jest.fn();

  const file: Blob = new Blob(['abc']);
  const pdf: PDF = new PDF(file);

  presenter.providers.path = {
    error: pathErrorStub,
    success: pathSuccessStub,
  };

  presenter.providers.applicationContext = applicationContext;

  it('should call the error path when an error occurs when validating the file', async () => {
    applicationContext
      .getUseCases()
      .validateFileInteractor.mockImplementation(() => {
        throw new Error('The file is not valid.');
      });

    await runAction(validateFileAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          primaryDocumentFile: '',
        },
      },
    });

    expect(pathErrorStub).toHaveBeenCalled();
  });

  it('should call the success path when no error occurs when validating the file', async () => {
    applicationContext
      .getUseCases()
      .validateFileInteractor.mockImplementation(() => null);

    await runAction(validateFileAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          primaryDocumentFile: pdf,
        },
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
  });
});
