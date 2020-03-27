import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { updateUserCaseNoteAction } from './updateUserCaseNoteAction';

describe('updateUserCaseNoteAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('update user case note', async () => {
    await runAction(updateUserCaseNoteAction, {
      modules: {
        presenter,
      },
      props: {
        caseId: 'case-id-123',
        notes: 'welcome to flavortown',
      },
    });

    expect(
      applicationContext.getUseCases().updateUserCaseNoteInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().updateUserCaseNoteInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      caseId: 'case-id-123',
      notes: 'welcome to flavortown',
    });
  });
});
