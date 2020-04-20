import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getJudgesCaseNoteForCaseAction } from './getJudgesCaseNoteForCaseAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getJudgesCaseNoteForCaseAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('call the use case to get the trial details', async () => {
    applicationContext
      .getUseCases()
      .getUserCaseNoteInteractor.mockResolvedValue({
        note: '123',
      });

    await runAction(getJudgesCaseNoteForCaseAction, {
      modules: {
        presenter,
      },
      state: { caseDetail: { caseId: '123' } },
    });
    expect(
      applicationContext.getUseCases().getUserCaseNoteInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().getUserCaseNoteInteractor.mock
        .calls[0][0].caseId,
    ).toEqual('123');
  });
});
