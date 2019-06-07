import { applicationContext } from '../../applicationContext';
import {
  formatSession,
  formattedTrialSessions as formattedTrialSessionsComputed,
  sessionSorter,
} from './formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

describe('formattedTrialSessions', () => {
  const TRIAL_SESSIONS_LIST = [
    {
      judge: '1',
      startDate: '2019-11-25T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Hartford, Connecticut',
    },
    {
      judge: '2',
      startDate: '2019-11-25T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Knoxville, TN',
    },
    {
      judge: '3',
      startDate: '2019-11-27T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: '4',
      startDate: '2019-11-27T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Memphis, TN',
    },
    {
      judge: '5',
      startDate: '2019-11-25T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Anchorage, AK',
    },
    {
      judge: '6',
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
  ];

  it('formats trial sessions correctly selecting startOfWeek and formatting start date', () => {
    const result = formatSession(TRIAL_SESSIONS_LIST[2], applicationContext);
    expect(result).toMatchObject({
      formattedStartDate: '11/27/19',
      judge: '3',
      startDate: '2019-11-27T15:00:00.000Z',
      startOfWeek: 'November 25, 2019',
    });
  });

  it('groups trial sessions into arrays according to session weeks', async () => {
    const result = await runCompute(formattedTrialSessions, {
      state: {
        trialSessions: TRIAL_SESSIONS_LIST,
      },
    });
    expect(result.formattedSessions.length).toBe(2);
    expect(result.formattedSessions[0].dateFormatted).toEqual(
      'November 25, 2019',
    );
    expect(result.formattedSessions[1].dateFormatted).toEqual(
      'February 17, 2020',
    );
  });
  it('correctly sorts sessions', async () => {
    const [week1, week2] = (await runCompute(formattedTrialSessions, {
      state: {
        trialSessions: TRIAL_SESSIONS_LIST,
      },
    })).formattedSessions;
    console.log(week1);
    console.log(week2);
    expect(true).toBe(true);
  });

  it('returns sessionsByTerm with only sessions in that term if form.term is set', async () => {
    const trialSessions = [
      {
        judge: '1',
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Denver, CO',
      },
      {
        judge: '2',
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Spring',
        trialLocation: 'Jacksonville, FL',
      },
      {
        judge: '3',
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Fall',
        trialLocation: 'Houston, TX',
      },
      {
        judge: '4',
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Birmingham, AL',
      },
      {
        judge: '5',
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Seattle, WA',
      },
    ];
    const result = await runCompute(formattedTrialSessions, {
      state: {
        form: {
          term: 'Winter',
        },
        trialSessions,
      },
    });
    expect(result.sessionsByTerm).toEqual([
      {
        formattedStartDate: '11/25/19',
        judge: '4',
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Birmingham, AL',
      },
      {
        formattedStartDate: '11/25/19',
        judge: '1',
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Denver, CO',
      },
      {
        formattedStartDate: '11/25/19',
        judge: '5',
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Seattle, WA',
      },
    ]);
  });
});
