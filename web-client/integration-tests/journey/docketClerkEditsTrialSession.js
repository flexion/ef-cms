import { formattedTrialSessionDetails as formattedTrialSessionDetailsComputed } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessionDetails = withAppContextDecorator(
  formattedTrialSessionDetailsComputed,
);

export const docketClerkEditsTrialSession = (
  integrationTest,
  overrides = {},
) => {
  return it('Docket clerk edits trial session', async () => {
    await integrationTest.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });
    expect(integrationTest.getState('currentPage')).toEqual('EditTrialSession');

    const mockNote = 'hello';
    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: overrides.fieldToUpdate || 'notes',
      value: overrides.valueToUpdate || mockNote,
    });

    await integrationTest.runSequence('updateTrialSessionSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('currentPage')).toEqual(
      'TrialSessionDetail',
    );

    const formatted = runCompute(formattedTrialSessionDetails, {
      state: integrationTest.getState(),
    });

    const expectedUpdatedValue =
      formatted[overrides.fieldToUpdate] || formatted.notes;
    const receivedUpdatedValue = overrides.valueToUpdate || mockNote;

    expect(expectedUpdatedValue).toEqual(receivedUpdatedValue);
  });
};
