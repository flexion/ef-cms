import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const submitLoginAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps): Promise<{
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  session?: string;
  userEmail?: string;
}> => {
  const { email, password } = get(state.form);

  try {
    const result = await applicationContext
      .getUseCases()
      .loginInteractor(applicationContext, { email, password });

    if (result.challengeName) {
      return path.changePassword({ session: result.session, userEmail: email });
    } else {
      const { accessToken, idToken, refreshToken } = result;
      return path.success({ accessToken, idToken, refreshToken });
    }
  } catch (err: any) {
    const originalErrorMessage = err?.originalError?.response?.data;

    if (originalErrorMessage === 'Invalid Username or Password') {
      return path.error({
        alertError: {
          message: 'The email address or password you entered is invalid.',
          title: 'Please correct the following errors:',
        },
      });
    }

    if (originalErrorMessage === 'User is unconfirmed') {
      return path.error({
        alertError: {
          message: (
            <>
              The email address is associated with an account but is not
              verified. We sent an email with a link to verify the email
              address. If you don’t see it, check your spam folder. If you’re
              still having trouble, email{' '}
              <a href="mailto:dawson.support@ustaxcourt.gov">
                dawson.support@ustaxcourt.gov
              </a>
              .
            </>
          ),
          title: 'Email address not verified',
        },
      });
    }

    return path.error({
      alertError: {
        title:
          'There was an unexpected error when logging in. Please try again.',
      },
    });
  }
};
