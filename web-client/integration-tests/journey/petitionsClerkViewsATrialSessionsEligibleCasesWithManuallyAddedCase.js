import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase =
  (integrationTest, expectedCount) => {
    return it('Petitions Clerk Views A Trial Sessions Eligible Cases', async () => {
      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });

      const eligibleCases = integrationTest.getState(
        'trialSession.eligibleCases',
      );

      expect(eligibleCases.length).toEqual(expectedCount);

      const manuallyAddedCase = eligibleCases.find(
        eligibleCase => eligibleCase.isManuallyAdded,
      );

      expect(manuallyAddedCase).toBeDefined();

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
