import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkRemovesCaseFromHearing = integrationTest => {
  return it('Docket clerk removes case from hearing', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence(
      'openRemoveFromTrialSessionModalSequence',
      {
        trialSessionId: integrationTest.createdTrialSessions[1],
      },
    );
    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'disposition',
      value: 'Test disposition',
    });

    await integrationTest.runSequence('removeCaseFromTrialSequence');

    const formattedCase = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(formattedCase.hearings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          trialSessionId: integrationTest.createdTrialSessions[1],
        }),
      ]),
    );
  });
};
