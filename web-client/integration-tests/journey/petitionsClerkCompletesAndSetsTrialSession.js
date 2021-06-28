import { wait } from '../helpers';

export const petitionsClerkCompletesAndSetsTrialSession = (
  integrationTest,
  overrides = {},
) => {
  return it('petitions clerk completes a trial session before calendaring', async () => {
    await integrationTest.runSequence('gotoEditTrialSessionSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });

    expect(integrationTest.getState('currentPage')).toEqual('EditTrialSession');

    await integrationTest.runSequence('openSetCalendarModalSequence');

    expect(integrationTest.getState('alertWarning')).toEqual({
      message: 'Provide an address and a judge to set this trial session.',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'address1',
      value: '123 Flavor Ave',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'city',
      value: 'Seattle',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'state',
      value: 'WA',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'postalCode',
      value: '98101',
    });

    await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
      key: 'judge',
      value: overrides.judge || {
        name: 'Cohen',
        userId: 'dabbad04-18d0-43ec-bafb-654e83405416',
      },
    });

    await integrationTest.runSequence('updateTrialSessionSequence');
    await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: integrationTest.trialSessionId,
    });
    expect(integrationTest.getState('currentPage')).toEqual(
      'TrialSessionDetail',
    );

    await integrationTest.runSequence('setTrialSessionCalendarSequence');
    await wait(1000); // we need to wait for some reason

    if (overrides.hasPaper) {
      expect(integrationTest.getState('currentPage')).toEqual(
        'PrintPaperTrialNotices',
      );
      expect(integrationTest.getState('alertWarning')).toEqual({
        message: 'Print and mail all paper service documents now.',
      });
    } else {
      expect(integrationTest.getState('currentPage')).toEqual(
        'TrialSessionDetail',
      );
      expect(integrationTest.getState('alertSuccess')).toEqual({
        message: 'Eligible cases set for trial.',
      });
    }
  });
};
