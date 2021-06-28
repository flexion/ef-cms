import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../src/applicationContext';
import { presenter } from '../src/presenter/presenter';

presenter.providers.applicationContext = applicationContext;
presenter.providers.router = { route: () => {} };

const integrationTest = CerebralTest(presenter);

describe('Miscellaneous', () => {
  it('Handles routing', async () => {
    await integrationTest.runSequence('gotoStyleGuideSequence');
    expect(integrationTest.getState('currentPage')).toEqual('StyleGuide');
  });

  it('Toggles USA Banner Content', async () => {
    await integrationTest.runSequence('toggleUsaBannerDetailsSequence');
    expect(integrationTest.getState('header.showUsaBannerDetails')).toEqual(
      true,
    );
    await integrationTest.runSequence('toggleUsaBannerDetailsSequence');
    expect(integrationTest.getState('header.showUsaBannerDetails')).toEqual(
      false,
    );
  });

  it('Toggles Beta Bar Visibility', async () => {
    expect(integrationTest.getState('header.showBetaBar')).toEqual(true);
    await integrationTest.runSequence('toggleBetaBarSequence');
    expect(integrationTest.getState('header.showBetaBar')).toEqual(false);
  });
});
