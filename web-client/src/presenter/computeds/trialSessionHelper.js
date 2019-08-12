import { state } from 'cerebral';

export const trialSessionHelper = (get, applicationContext) => {
  const trialSession = get(state.trialSession);
  if (!trialSession) return {};

  const assignedJudgeIsCurrentUser =
    trialSession.judgeId &&
    trialSession.judgeId == applicationContext.getCurrentUser().userId;

  const showSwitchToSessionDetail =
    assignedJudgeIsCurrentUser &&
    'TrialSessionWorkingCopy'.includes(get(state.currentPage));
  const showSwitchToWorkingCopy =
    assignedJudgeIsCurrentUser &&
    'TrialSessionDetail'.includes(get(state.currentPage));

  const result = {
    assignedJudgeIsCurrentUser,
    showSwitchToSessionDetail,
    showSwitchToWorkingCopy,
    title: 'Session Working Copy',
  };

  return result;
};
