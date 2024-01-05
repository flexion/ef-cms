export const confirmSignUpAction = async ({
  applicationContext,
  path,
  props,
}: ActionProps<{ confirmationCode: string; userId: string }>) => {
  const { confirmationCode, userId } = props;

  try {
    await applicationContext
      .getUseCases()
      .confirmSignUpInteractor(applicationContext, {
        confirmationCode,
        userId,
      });

    // 10007 TODO: make path.success
    return path.yes({
      alertSuccess: {
        message:
          'Your email address is verified. You can now sign in to DAWSON.',
        title: 'Email address verified',
      },
    });
  } catch (e) {
    // 10007 TODO: make path.error
    return path.no({
      alertError: {
        message: 'Error confirming account',
      },
    });
  }
};
