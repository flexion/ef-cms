import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getUserCaseNoteForCasesAction } from './getUserCaseNoteForCasesAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getUserCaseNoteForCasesAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('call the use case to get the user case note for cases', async () => {
    applicationContext
      .getUseCases()
      .getUserCaseNoteForCasesInteractor.mockResolvedValue([
        {
          caseId: 'case-id-123',
          note: 'welcome to flavortown',
          userId: 'user-id-123',
        },
        {
          caseId: 'case-id-234',
          note: 'hi there face here',
          userId: 'user-id-234',
        },
      ]);

    await runAction(getUserCaseNoteForCasesAction, {
      modules: {
        presenter,
      },
      props: {
        trialSession: {
          caseOrder: [{ caseId: 'case-id-123' }, { caseId: 'case-id-234' }],
        },
      },
    });

    expect(
      applicationContext.getUseCases().getUserCaseNoteForCasesInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().getUserCaseNoteForCasesInteractor.mock
        .calls[0][0].caseIds,
    ).toEqual(['case-id-123', 'case-id-234']);
  });
});
