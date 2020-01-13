import { runAction } from 'cerebral/test';
import { setTrialSessionCalendarAlertWarningAction } from './setTrialSessionCalendarAlertWarningAction';

describe('setTrialSessionCalendarAlertWarningAction', () => {
  it('should set state.alertWarning with the print paper service for parties message', async () => {
    const result = await runAction(setTrialSessionCalendarAlertWarningAction);

    expect(result.output).toEqual({
      alertWarning: {
        message:
          'These cases have parties receiving paper service. Print and mail all paper service documents below.',
      },
    });
  });
});
