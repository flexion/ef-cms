import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsATrialSessionsEligibleCases = (
  integrationTest,
  expectedCount,
) => {
  return it('Petitions Clerk Views A Trial Sessions Eligible Cases', async () => {
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    expect(
      integrationTest.getState('trialSession.eligibleCases').length,
    ).toEqual(expectedCount);
    expect(integrationTest.getState('trialSession.isCalendared')).toEqual(
      false,
    );

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: integrationTest.getState(),
      },
    );
    expect(trialSessionFormatted.computedStatus).toEqual('New');
  });
};
