import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setAllAndCurrentJudgesAction } from './setAllAndCurrentJudgesAction';

describe('setAllAndCurrentJudgesAction', () => {
  const { USER_ROLES } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });
  it('populates state.allJudges with all users.props whose role is "judge" or "legacyJudge"', async () => {
    const result = await runAction(setAllAndCurrentJudgesAction, {
      modules: { presenter },
      props: {
        users: [
          { name: 'I am not a legacy judge', role: USER_ROLES.judge },
          { name: 'I am a legacy judge', role: USER_ROLES.legacyJudge },
        ],
      },
    });

    expect(result.state.allJudges.length).toBe(2);
  });

  it('populates state.currentJudges with all users.props whose role is "judge"', async () => {
    const result = await runAction(setAllAndCurrentJudgesAction, {
      modules: { presenter },
      props: {
        users: [
          { name: 'I am not a legacy judge', role: USER_ROLES.judge },
          { name: 'I am a legacy judge', role: USER_ROLES.legacyJudge },
        ],
      },
    });

    expect(result.state.currentJudges.length).toBe(1);
    expect(result.state.currentJudges[0]).toEqual({
      name: 'I am not a legacy judge',
      role: USER_ROLES.judge,
    });
  });
});
