import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { formatSession } from './formattedTrialSessions';
import { set30DayNoticeOfTrialReminder } from './utilities/set30DayNoticeOfTrialReminder';
jest.mock('./utilities/set30DayNoticeOfTrialReminder', () => {
  return { set30DayNoticeOfTrialReminder: jest.fn() };
});

describe('formattedTrialSessions formatSession', () => {
  const mockTrialSessions = [
    {
      caseOrder: [],
      dismissedAlertForNOTT: false,
      isCalendared: true,
      judge: { name: '3', userId: '3' },
      noticeIssuedDate: '2019-07-25T15:00:00.000Z',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: SESSION_TYPES.regular,
      startDate: '2019-11-27T15:00:00.000Z',
      swingSession: true,
      term: 'Winter',
      trialLocation: 'Jacksonville, FL',
    },
    {
      caseOrder: [],
      estimatedEndDate: '2045-02-17T15:00:00.000Z',
      judge: { name: '6', userId: '6' },
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: SESSION_TYPES.regular,
      startDate: '2044-02-17T15:00:00.000Z',
      swingSession: false,
      term: 'Spring',
      trialLocation: 'Jacksonville, FL',
    },
  ];

  beforeEach(() =>
    set30DayNoticeOfTrialReminder.mockReturnValue({
      isCurrentDateWithinReminderRange: true,
      thirtyDaysBeforeTrialFormatted: '2020/10/10',
    }),
  );

  it('formats trial sessions correctly selecting startOfWeek and formatting start date, startOfWeekSortable, and formattedNoticeIssued', () => {
    const result = formatSession(mockTrialSessions[0], applicationContext);
    expect(result).toMatchObject({
      formattedNoticeIssuedDate: '07/25/2019',
      formattedStartDate: '11/27/19',
      judge: { name: '3', userId: '3' },
      startDate: '2019-11-27T15:00:00.000Z',
      startOfWeek: 'November 25, 2019',
      startOfWeekSortable: '20191125',
    });
  });

  it('should format start date and estimated end date as "MM/DD/YYYY"', () => {
    const result = formatSession(mockTrialSessions[1], applicationContext);
    expect(result).toMatchObject({
      formattedEstimatedEndDate: '02/17/45',
      formattedStartDate: '02/17/44',
    });
  });

  it('should set an NOTT reminder flag and message when the session is calendared and no previous notification has been dismissed', () => {
    const result = formatSession(mockTrialSessions[0], applicationContext);

    expect(result).toMatchObject({
      alertMessageForNOTT: 'The 30-day notice is due before 2020/10/10',
      showAlertForNOTTReminder: true,
    });
  });

  it('should NOT set an NOTT reminder flag when the alert has been previously dismissed', () => {
    formatSession(
      {
        ...mockTrialSessions[0],
        dismissedAlertForNOTT: true,
        isCalendared: true,
      },
      applicationContext,
    );

    expect(set30DayNoticeOfTrialReminder).not.toHaveBeenCalled();
  });

  it('should NOT set an NOTT reminder flag when the session is NOT calendared', () => {
    formatSession(
      {
        ...mockTrialSessions[0],
        dismissedAlertForNOTT: false,
        isCalendared: false,
      },
      applicationContext,
    );

    expect(set30DayNoticeOfTrialReminder).not.toHaveBeenCalled();
  });
});
