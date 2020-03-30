import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { startDelayedLogoutAction } from './startDelayedLogoutAction';

describe('startDelayedLogoutAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('creates a timer and stores it in state', async () => {
    const result = await runAction(startDelayedLogoutAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {},
    });
    expect(result.state.logoutTimer).not.toBeNull();
  });
});
