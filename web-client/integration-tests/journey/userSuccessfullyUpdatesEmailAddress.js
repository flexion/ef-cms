import { headerHelper as headerHelperComputed } from '../../src/presenter/computeds/headerHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const headerHelper = withAppContextDecorator(headerHelperComputed);

export const userSuccessfullyUpdatesEmailAddress = (
  integrationTest,
  user,
  mockUpdatedEmail,
) =>
  it(`${user} successfully updates email address`, async () => {
    await integrationTest.runSequence('gotoChangeLoginAndServiceEmailSequence');

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'email',
      value: mockUpdatedEmail,
    });

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'confirmEmail',
      value: mockUpdatedEmail,
    });

    await integrationTest.runSequence(
      'submitChangeLoginAndServiceEmailSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'VerifyNewEmailModal',
    );

    await integrationTest.runSequence(
      'closeVerifyEmailModalAndNavigateToMyAccountSequence',
      {
        path: '/my-account',
      },
    );

    expect(integrationTest.getState('currentPage')).toEqual('MyAccount');

    const header = runCompute(headerHelper, {
      state: integrationTest.getState(),
    });

    expect(header.showVerifyEmailWarningNotification).toBeTruthy();
  });
