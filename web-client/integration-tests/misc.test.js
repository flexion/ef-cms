import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../src/applicationContext';
import { presenter } from '../src/presenter/presenter';

presenter.providers.applicationContext = applicationContext;
presenter.providers.router = { route: () => {} };

const test = CerebralTest(presenter);

describe('Miscellaneous', () => {
  it('Handles routing', async () => {
    await test.runSequence('gotoStyleGuideSequence');
    expect(test.getState('currentPage')).toEqual('StyleGuide');
  });

  it('Toggles USA Banner Content', async () => {
    await test.runSequence('toggleUsaBannerDetailsSequence');
    expect(test.getState('header.showUsaBannerDetails')).toEqual(true);
    await test.runSequence('toggleUsaBannerDetailsSequence');
    expect(test.getState('header.showUsaBannerDetails')).toEqual(false);
  });

  it('Toggles Beta Bar Visibility', async () => {
    expect(test.getState('header.showBetaBar')).toEqual(true);
    await test.runSequence('toggleBetaBarSequence');
    expect(test.getState('header.showBetaBar')).toEqual(false);
  });

  it('Toggles payment info content', async () => {
    await test.runSequence('togglePaymentDetailsSequence');
    expect(test.getState('paymentInfo.showDetails')).toEqual(true);
    await test.runSequence('togglePaymentDetailsSequence');
    expect(test.getState('paymentInfo.showDetails')).toEqual(false);
  });
});
