import { addToTrialSessionModalHelper as addToTrialSessionModalHelperComputed } from '../../src/presenter/computeds/addToTrialSessionModalHelper';
import { runCompute } from 'cerebral/test';
import { wait } from '../helpers';
import { withAppContextDecorator } from '../../src/withAppContext';

const addToTrialSessionModalHelper = withAppContextDecorator(
  addToTrialSessionModalHelperComputed,
);

export const petitionsClerkManuallyAddsCaseToTrial = integrationTest => {
  return it('Petitions clerk manually adds a case to an uncalendared trial session', async () => {
    const caseToAdd =
      integrationTest.casesReadyForTrial[
        integrationTest.casesReadyForTrial.length - 1
      ];

    integrationTest.manuallyAddedTrialCaseDocketNumber = caseToAdd.docketNumber;

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: caseToAdd.docketNumber,
    });

    await integrationTest.runSequence('openAddToTrialModalSequence');

    let modalHelper = await runCompute(addToTrialSessionModalHelper, {
      state: integrationTest.getState(),
    });

    expect(modalHelper.showSessionNotSetAlert).toEqual(false);

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await integrationTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: integrationTest.trialSessionId,
    });

    // Because the selected trial session is not yet calendared, we should show
    // the alert in the UI stating so.
    modalHelper = await runCompute(addToTrialSessionModalHelper, {
      state: integrationTest.getState(),
    });

    expect(modalHelper.showSessionNotSetAlert).toEqual(true);

    await integrationTest.runSequence('addCaseToTrialSessionSequence');
    await wait(1000);

    const trialSessionJudge = integrationTest.getState('trialSessionJudge');
    expect(trialSessionJudge).toMatchObject(
      expect.objectContaining({
        name: expect.anything(),
        userId: expect.anything(),
      }),
    );
  });
};
