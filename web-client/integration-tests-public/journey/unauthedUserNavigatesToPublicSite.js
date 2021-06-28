import { applicationContextPublic as applicationContext } from '../../src/applicationContextPublic';

export const unauthedUserNavigatesToPublicSite = integrationTest => {
  return it('Should navigate to the public site without logging in', async () => {
    await integrationTest.runSequence('navigateToPublicSiteSequence', {});
    expect(integrationTest.currentRouteUrl).toEqual(
      applicationContext.getPublicSiteUrl(),
    );
  });
};
