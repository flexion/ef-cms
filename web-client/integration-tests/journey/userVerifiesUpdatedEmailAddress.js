import { getUserRecordById } from '../helpers';

export const userVerifiesUpdatedEmailAddress = (integrationTest, user) =>
  it(`${user} verifies updated email address`, async () => {
    const userFromState = integrationTest.getState('user');
    const userFromPersistence = await getUserRecordById(userFromState.userId);

    const emailVerificationToken =
      userFromPersistence.pendingEmailVerificationToken;

    await integrationTest.runSequence('navigateToPathSequence', {
      path: `/verify-email?token=${emailVerificationToken}`,
    });

    expect(window.location.replace).toHaveBeenCalledWith(
      'http://localhost:5678/email-verification-success',
    );
  });
