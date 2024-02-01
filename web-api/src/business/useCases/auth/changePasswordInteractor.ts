import { AdminSetUserPasswordCommandInput } from '@aws-sdk/client-cognito-identity-provider';
import { ChangePasswordForm } from '@shared/business/entities/ChangePasswordForm';
import {
  InvalidEntityError,
  InvalidRequest,
  NotFoundError,
} from '@web-api/errors/errors';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { RawUser, User } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { authErrorHandling } from '@web-api/business/useCases/auth/loginInteractor';
import jwt from 'jsonwebtoken';

export const changePasswordInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    code,
    confirmPassword,
    password,
    tempPassword,
    userEmail,
  }: {
    password: string;
    tempPassword?: string;
    userEmail: string;
    confirmPassword: string;
    code?: string;
  },
): Promise<{ idToken: string; accessToken: string; refreshToken: string }> => {
  try {
    const errors = new ChangePasswordForm({
      confirmPassword,
      password,
      userEmail,
    }).getFormattedValidationErrors();
    if (errors) {
      throw new InvalidEntityError('Change Password Form Entity is invalid');
    }
    if (tempPassword) {
      const initiateAuthResult = await applicationContext
        .getCognito()
        .initiateAuth({
          AuthFlow: 'USER_PASSWORD_AUTH',
          AuthParameters: {
            PASSWORD: tempPassword,
            USERNAME: userEmail,
          },
          ClientId: applicationContext.environment.cognitoClientId,
        });

      if (initiateAuthResult.ChallengeName !== 'NEW_PASSWORD_REQUIRED') {
        throw new Error('User is not in `FORCE_CHANGE_PASSWORD` state');
      }

      const result = await applicationContext
        .getCognito()
        .respondToAuthChallenge({
          ChallengeName: 'NEW_PASSWORD_REQUIRED',
          ChallengeResponses: {
            NEW_PASSWORD: password,
            USERNAME: userEmail,
          },
          ClientId: applicationContext.environment.cognitoClientId,
          Session: initiateAuthResult.Session,
        });

      if (
        !result.AuthenticationResult?.AccessToken ||
        !result.AuthenticationResult?.IdToken ||
        !result.AuthenticationResult?.RefreshToken
      ) {
        throw new Error('Unsuccessful password change');
      }

      const decoded = jwt.decode(result.AuthenticationResult?.IdToken);
      const userId = decoded['custom:userId'] || decoded.sub;

      const userFromPersistence = await applicationContext
        .getPersistenceGateway()
        .getUserById({ applicationContext, userId });

      if (
        userFromPersistence &&
        userFromPersistence.pendingEmail &&
        userFromPersistence.pendingEmail === userEmail
      ) {
        const { updatedUser } = await updateUserEmailAddress(
          applicationContext,
          {
            user: userFromPersistence,
          },
        );

        await applicationContext
          .getWorkerGateway()
          .initialize(applicationContext, {
            message: {
              payload: { user: updatedUser },
              type: MESSAGE_TYPES.QUEUE_UPDATE_ASSOCIATED_CASES,
            },
          });
      }

      return {
        accessToken: result.AuthenticationResult.AccessToken,
        idToken: result.AuthenticationResult.IdToken,
        refreshToken: result.AuthenticationResult.RefreshToken,
      };
    } else {
      const user = await applicationContext
        .getUserGateway()
        .getUserByEmail(applicationContext, { email: userEmail });

      if (!user) {
        throw new NotFoundError(`User not found with email: ${userEmail}`);
      }

      const codeFromPersistence = await applicationContext
        .getPersistenceGateway()
        .getForgotPasswordCode(applicationContext, { userId: user.userId });

      if (!codeFromPersistence || code !== codeFromPersistence) {
        throw new InvalidRequest('Forgot password code expired');
      }

      const adminSetUserPasswordParams: AdminSetUserPasswordCommandInput = {
        Password: password,
        Permanent: true,
        UserPoolId: applicationContext.environment.userPoolId,
        Username: userEmail,
      };
      await applicationContext
        .getCognito()
        .adminSetUserPassword(adminSetUserPasswordParams);

      const result = await applicationContext.getCognito().initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: {
          PASSWORD: password,
          USERNAME: userEmail,
        },
        ClientId: applicationContext.environment.cognitoClientId,
      });

      return {
        accessToken: result.AuthenticationResult!.AccessToken!,
        idToken: result.AuthenticationResult!.IdToken!,
        refreshToken: result.AuthenticationResult!.RefreshToken!,
      };
    }
  } catch (err: any) {
    await authErrorHandling(applicationContext, {
      email: userEmail,
      error: err,
      sendAccountConfirmation: false,
    });
    throw err;
  }
};

export const updateUserEmailAddress = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: RawUser },
): Promise<{ updatedUser: RawPractitioner | RawUser }> => {
  let userEntity;
  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.inactivePractitioner
  ) {
    userEntity = new Practitioner({
      ...user,
      email: user.pendingEmail,
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  } else {
    userEntity = new User({
      ...user,
      email: user.pendingEmail,
      pendingEmail: undefined,
      pendingEmailVerificationToken: undefined,
    });
  }

  const rawUser = userEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: rawUser,
  });

  return { updatedUser: rawUser };
};