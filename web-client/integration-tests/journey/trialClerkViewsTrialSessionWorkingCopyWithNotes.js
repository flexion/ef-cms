import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from '../../src/presenter/computeds/trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const trialSessionWorkingCopyHelper = withAppContextDecorator(
  trialSessionWorkingCopyHelperComputed,
);

export const trialClerkViewsTrialSessionWorkingCopyWithNotes =
  integrationTest => {
    return it('Trial Clerk views trial session working copy with notes', async () => {
      await integrationTest.runSequence('gotoTrialSessionWorkingCopySequence', {
        trialSessionId: integrationTest.trialSessionId,
      });
      expect(integrationTest.getState('currentPage')).toEqual(
        'TrialSessionWorkingCopy',
      );
      expect(
        integrationTest.getState('trialSessionWorkingCopy.trialSessionId'),
      ).toEqual(integrationTest.trialSessionId);

      let workingCopyHelper = runCompute(trialSessionWorkingCopyHelper, {
        state: integrationTest.getState(),
      });

      const { docketNumber } = workingCopyHelper.formattedCases[0];

      expect(
        integrationTest.getState(
          `trialSessionWorkingCopy.userNotes.${docketNumber}.notes`,
        ),
      ).toEqual('this is a note added from the modal');
    });
  };
