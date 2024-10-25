import { ExtendedTrialSessionInfoDTO } from '@web-client/presenter/computeds/trialSessionsHelper';
import { state } from '@web-client/presenter/app.cerebral';

const mergeSessions = (
  specialTrialSessionCopyNotes,
  trialSessions,
): ExtendedTrialSessionInfoDTO[] => {
  const mergedSessions = {};

  specialTrialSessionCopyNotes.forEach(session => {
    mergedSessions[session.trialSessionId] = { ...session };
  });

  trialSessions.forEach(session => {
    if (mergedSessions[session.trialSessionId]) {
      mergedSessions[session.trialSessionId] = {
        ...mergedSessions[session.trialSessionId],
        ...session,
      };
    } else {
      mergedSessions[session.trialSessionId] = { ...session };
    }
  });

  return Object.values(mergedSessions);
};
export const setTrialSessionsPageAction = ({ props, store }: ActionProps) => {
  const { specialTrialSessionCopyNotes, trialSessions } = props;
  const mergedTrialSessions = mergeSessions(
    specialTrialSessionCopyNotes,
    trialSessions,
  );

  store.set(state.trialSessionsPage.trialSessions, mergedTrialSessions);
};
