import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkViewsTrialSessionWithNote = integrationTest => {
  return it('Docket Clerk Views trial session with note', async () => {
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

    const foundCase = trialSessionFormatted.caseOrder.find(
      _case => _case.docketNumber == integrationTest.docketNumber,
    );

    expect(foundCase).toBeTruthy();

    expect(foundCase.calendarNotes).toEqual(integrationTest.calendarNote);
  });
};
