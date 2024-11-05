import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export interface SpecialTrialSession {
  userId: string;
  trialSessionId: string;
}

export interface SpecialTrialSessionKey {
  pk: string;
  sk: string;
}

export interface TrialSessionWorkingCopyNotes {
  sessionNotes: string;
  trialSessionId: string;
}

export const getBulkTrialSessionCopyNotesInteractor = async (
  applicationContext: ServerApplicationContext,
  { specialTrialSessions }: { specialTrialSessions: SpecialTrialSession[] },
  authorizedUser: UnknownAuthUser,
): Promise<Array<TrialSessionWorkingCopyNotes>> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const specialTrialSessionKeys: Array<SpecialTrialSessionKey> =
    specialTrialSessions.map(
      (t: SpecialTrialSession): SpecialTrialSessionKey => ({
        pk: `trial-session-working-copy|${t.trialSessionId}`,
        sk: `user|${t.userId}`,
      }),
    );

  return await applicationContext
    .getPersistenceGateway()
    .getBulkTrialSessionWorkingCopyNotes({
      applicationContext,
      specialTrialSessions: specialTrialSessionKeys,
    });
};
