import { state } from 'cerebral';

export const trialSessionHelper = (get, applicationContext) => {
  const trialSession = get(state.trialSession);
  if (!trialSession) return undefined;

  const assignedJudgeIsCurrentUser =
    trialSession.judgeId &&
    trialSession.judgeId == applicationContext.getCurrentUser().userId;
  const showSwitchToSessionDetails = true;
  const showSwitchToWorkingCopy = true;

  const result = {
    assignedJudgeIsCurrentUser,
    showSwitchToSessionDetails,
    showSwitchToWorkingCopy,
  };

  return result;
};
