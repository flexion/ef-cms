import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { setIdleStatusIdleSequence } from '../sequences/setIdleStatusIdleSequence';

describe('setIdleStatusIdleSequence', () => {
  let integrationTest;
  beforeAll(() => {
    jest.useFakeTimers();
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      setIdleStatusIdleSequence,
    };
    integrationTest = CerebralTest(presenter);
  });
  it('should show the idle status modal and set a delayed logout timer', async () => {
    integrationTest.setState('modal.showModal', 'SomeOtherModal');
    await integrationTest.runSequence('setIdleStatusIdleSequence');
    expect(integrationTest.getState('modal.showModal')).toBe('AppTimeoutModal');
    const logoutTimer = integrationTest.getState('logoutTimer');
    expect(logoutTimer).not.toBeNull();
    jest.clearAllTimers();
  });
});
