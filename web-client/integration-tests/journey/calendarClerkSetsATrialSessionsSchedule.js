import { wait } from '../helpers';

export default test => {
  return it('Calendar Clerk Sets A Trial Sessions Schedule', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    await test.runSequence('setTrialSessionCalendarSequence');
    await wait(4000);
  });
};
