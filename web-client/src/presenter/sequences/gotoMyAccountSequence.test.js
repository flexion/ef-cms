import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { gotoMyAccountSequence } from '../sequences/gotoMyAccountSequence';
import { presenter } from '../presenter-mock';

describe('gotoMyAccountSequence', () => {
  let integrationTest;

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoMyAccountSequence,
    };
    integrationTest = CerebralTest(presenter);
  });

  it('should change the page to MyAccount and close the opened menu', async () => {
    integrationTest.setState('currentPage', 'SomeOtherPage');
    integrationTest.setState('navigation.openMenu', true);
    await integrationTest.runSequence('gotoMyAccountSequence');
    expect(integrationTest.getState('currentPage')).toBe('MyAccount');
    expect(integrationTest.getState('navigation.openMenu')).toBeUndefined();
  });
});
