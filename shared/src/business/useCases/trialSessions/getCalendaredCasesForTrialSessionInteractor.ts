import { CalendaredCase } from '@shared/business/entities/cases/CalendaredCase';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const getCalendaredCasesForTrialSessionInteractor = async (
  applicationContext: IApplicationContext,
  { trialSessionId }: { trialSessionId: string },
) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  const casesWithMinimalRequiredInformation = cases.map(aCase => {
    return new CalendaredCase(aCase, applicationContext)
      .validate()
      .toRawObject();
  });

  return casesWithMinimalRequiredInformation;
};
