import { downloadBatchOfTrialSessionAction } from './downloadBatchOfTrialSessionAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import sinon from 'sinon';

let batchDownloadTrialSessionInteractorStub;

describe('downloadBatchOfTrialSessionAction', () => {
  beforeEach(() => {
    batchDownloadTrialSessionInteractorStub = sinon
      .stub()
      .resolves(new Blob([]));

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        batchDownloadTrialSessionInteractor: batchDownloadTrialSessionInteractorStub,
      }),
    };
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
