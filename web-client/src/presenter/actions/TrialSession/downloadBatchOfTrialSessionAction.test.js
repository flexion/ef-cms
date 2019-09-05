import {
  createISODateString,
  formatDateString,
  prepareDateFromString,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { downloadBatchOfTrialSessionAction } from './downloadBatchOfTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let batchDownloadTrialSessionInteractorStub;

describe('downloadBatchOfTrialSessionAction', () => {
  beforeEach(() => {
    batchDownloadTrialSessionInteractorStub = sinon.stub().resolves();

    global.window = {
      URL: { createObjectURL: () => {}, revokeObjectURL: () => {} },
    };
    global.document = {
      body: { appendChild: () => {} },
      createElement: () => ({
        click: () => {},
        parentNode: { removeChild: () => {} },
      }),
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        batchDownloadTrialSessionInteractor: batchDownloadTrialSessionInteractorStub,
      }),
      getUtilities: () => {
        return {
          createISODateString,
          formatDateString,
          prepareDateFromString,
        };
      },
    };
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
  });

  it('call the use case to get the batch of the case', async () => {
    await runAction(downloadBatchOfTrialSessionAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetails: {},
        trialSession: {},
        trialSessionId: '123',
      },
      state: {},
    });
    expect(batchDownloadTrialSessionInteractorStub.calledOnce).toEqual(true);
  });
});
