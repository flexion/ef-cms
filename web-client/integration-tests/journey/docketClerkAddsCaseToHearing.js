import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const docketClerkAddsCaseToHearing = (
  integrationTest,
  notes = 'test note for hearing',
  index = 1,
) => {
  return it('docket clerk adds case to hearing', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('openSetForHearingModalSequence');

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: integrationTest.createdTrialSessions[index],
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'calendarNotes',
      value: notes,
    });

    await integrationTest.runSequence('setForHearingSequence');
    expect(integrationTest.getState('validationErrors')).toEqual({});

    const formattedCase = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });

    expect(formattedCase.hearings).toMatchObject([
      {
        addedToSessionAt: expect.anything(),
        calendarNotes: notes,
        trialSessionId: integrationTest.createdTrialSessions[index],
      },
    ]);
  });
};
