import { runCompute } from 'cerebral/test';
import { trialSessionHelper as trialSessionHelperComputed } from './trialSessionHelper';
import { withAppContextDecorator } from '../../withAppContext';

let currentUser = {
  role: 'judgeArmen',
  section: 'judge',
  userId: '777',
};

const trialSessionHelper = withAppContextDecorator(trialSessionHelperComputed, {
  getCurrentUser: () => currentUser,
});

describe('trial session helper computed', () => {
  it('computes defaults with no data', () => {
    const result = runCompute(trialSessionHelper, {});
    expect(result).toBeDefined();
  });

  it('does not show switch-links in header if not assigned judge', () => {
    const result = runCompute(trialSessionHelper, {
      state: {
        currentPage: 'TrialSessionDetail',
        trialSession: {
          judgeId: '98765',
        },
      },
    });
    expect(result).toMatchObject({
      assignedJudgeIsCurrentUser: false,
      showSwitchToSessionDetail: false,
      showSwitchToWorkingCopy: false,
    });
  });

  it('shows "Switch to Session Detail" in header if viewing Working Copy and user is assigned judge', () => {
    const result = runCompute(trialSessionHelper, {
      state: {
        currentPage: 'TrialSessionWorkingCopy',
        trialSession: {
          judgeId: '777',
        },
      },
    });
    expect(result).toMatchObject({
      assignedJudgeIsCurrentUser: true,
      showSwitchToSessionDetail: true,
      showSwitchToWorkingCopy: false,
    });
  });

  it('shows "Switch to Session Working Copy" in header if viewing Session Detail and user is assigned judge', () => {
    const result = runCompute(trialSessionHelper, {
      state: {
        currentPage: 'TrialSessionDetail',
        trialSession: {
          judgeId: '777',
        },
      },
    });
    expect(result).toMatchObject({
      assignedJudgeIsCurrentUser: true,
      showSwitchToSessionDetail: false,
      showSwitchToWorkingCopy: true,
    });
  });
});
