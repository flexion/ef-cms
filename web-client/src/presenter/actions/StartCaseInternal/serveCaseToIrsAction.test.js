import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { serveCaseToIrsAction } from './serveCaseToIrsAction';

describe('serveCaseToIrsAction', () => {
  let pathPaperStub;
  let pathElectronicStub;
  let createObjectURLStub;

  beforeEach(() => {
    global.window = global;
    global.Blob = () => {};

    pathPaperStub = jest.fn();
    pathElectronicStub = jest.fn();
    createObjectURLStub = jest.fn().mockReturnValue('123456-abcdef');

    presenter.providers.router = {
      createObjectURL: createObjectURLStub,
    };

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      electronic: pathElectronicStub,
      paper: pathPaperStub,
    };
  });

  it('should serve an electronic case', async () => {
    await runAction(serveCaseToIrsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: 'abc-123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().serveCaseToIrsInteractor,
    ).toHaveBeenCalled();
    expect(pathElectronicStub).toHaveBeenCalled();
  });

  it('serves a paper case and return the paper path', async () => {
    applicationContext
      .getUseCases()
      .serveCaseToIrsInteractor.mockReturnValue(['pdf-bytes']);

    await runAction(serveCaseToIrsAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          trialSessionId: 'abc-123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().serveCaseToIrsInteractor,
    ).toHaveBeenCalled();
    expect(pathPaperStub).toHaveBeenCalled();
  });
});
