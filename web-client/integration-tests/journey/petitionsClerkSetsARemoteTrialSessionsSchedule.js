import { wait } from '../helpers';

export const petitionsClerkSetsARemoteTrialSessionsSchedule =
  integrationTest => {
    return it('Petitions Clerk Sets A Remote Trial Sessions Schedule', async () => {
      await integrationTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });
      await integrationTest.runSequence('openSetCalendarModalSequence');

      expect(integrationTest.getState('alertWarning.message')).toEqual(
        'Provide remote proceeding information to set this trial session.',
      );

      await integrationTest.runSequence('gotoEditTrialSessionSequence', {
        trialSessionId: integrationTest.trialSessionId,
      });

      await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
        key: 'meetingId',
        value: '123456789',
      });

      await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
        key: 'password',
        value: '123456789',
      });

      await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
        key: 'joinPhoneNumber',
        value: '123456789',
      });

      await integrationTest.runSequence('updateTrialSessionFormDataSequence', {
        key: 'chambersPhoneNumber',
        value: '123456789',
      });

      await integrationTest.runSequence('updateTrialSessionSequence');

      await integrationTest.runSequence('openSetCalendarModalSequence');

      expect(integrationTest.getState('alertWarning.message')).toBeUndefined();

      await integrationTest.runSequence('setTrialSessionCalendarSequence');

      await wait(1000);
    });
  };
