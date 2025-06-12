import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { toKyselyNewTrialSession } from './mapper';

export const createTrialSession = async (rawTrialSession: RawTrialSession) => {
  const trialSessionToInsert = toKyselyNewTrialSession(rawTrialSession);

  await pgInsertInto({
    table: 'dwTrialSession',
    values: trialSessionToInsert,
    onConflictColumns: ['trialSessionId'],
  });
};
