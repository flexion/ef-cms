import { find } from 'lodash';
import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

export const docketClerkViewsTrialSessionList = integrationTest => {
  return it('Docket clerk views trial session list', async () => {
    await integrationTest.runSequence('gotoTrialSessionsSequence');
    expect(integrationTest.getState('currentPage')).toEqual('TrialSessions');

    const formatted = runCompute(formattedTrialSessions, {
      state: integrationTest.getState(),
    });
    expect(formatted.formattedSessions.length).toBeGreaterThan(0);

    const trialSession = find(formatted.sessionsByTerm, {
      trialSessionId: integrationTest.lastCreatedTrialSessionId,
    });

    expect(trialSession).toBeDefined();

    integrationTest.trialSessionId =
      trialSession && trialSession.trialSessionId;
    if (integrationTest.createdTrialSessions) {
      integrationTest.createdTrialSessions.push(integrationTest.trialSessionId);
    }
  });
};
