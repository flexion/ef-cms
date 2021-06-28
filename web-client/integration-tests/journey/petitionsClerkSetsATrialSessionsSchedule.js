import { wait } from '../helpers';

export const petitionsClerkSetsATrialSessionsSchedule = integrationTest => {
  return it('Petitions Clerk Sets A Trial Sessions Schedule', async () => {
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    await integrationTest.runSequence('openSetCalendarModalSequence');
    expect(integrationTest.getState('alertWarning.message')).toBeUndefined();

    await integrationTest.runSequence('setTrialSessionCalendarSequence');
    await wait(1000);
  });
};
