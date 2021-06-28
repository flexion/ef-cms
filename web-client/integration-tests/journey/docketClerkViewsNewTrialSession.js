import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsNewTrialSession = (
  integrationTest,
  checkCase,
  calendarNote,
) => {
  return it('Docket Clerk Views a new trial session', async () => {
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: integrationTest.getState(),
      },
    );

    expect(trialSessionFormatted.computedStatus).toEqual('New');

    if (checkCase) {
      const foundCase = trialSessionFormatted.caseOrder.find(
        _case => _case.docketNumber == integrationTest.docketNumber,
      );

      expect(foundCase).toBeTruthy();

      if (calendarNote) {
        expect(foundCase.calendarNotes).toEqual(calendarNote);
      }
    }
  });
};
