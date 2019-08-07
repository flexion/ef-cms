import { applicationContext } from '../../applicationContext';
import {
  formatSession,
  formattedTrialSessions as formattedTrialSessionsComputed,
} from './formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

describe('formattedTrialSessions', () => {
  const TRIAL_SESSIONS_LIST = [
    {
      judge: { name: '1', userId: '1' },
      startDate: '2019-11-25T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Hartford, Connecticut',
    },
    {
      judge: { name: '2', userId: '2' },
      startDate: '2019-11-25T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Knoxville, TN',
    },
    {
      judge: { name: '3', userId: '3' },
      startDate: '2019-11-27T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Jacksonville, FL',
    },
    {
      judge: { name: '4', userId: '4' },
      startDate: '2019-11-27T15:00:00.000Z',
      swingSession: true,
      trialLocation: 'Memphis, TN',
    },
    {
      judge: { name: '5', userId: '5' },
      startDate: '2019-11-25T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Anchorage, AK',
    },
    {
      judge: { name: '6', userId: '6' },
      startDate: '2020-02-17T15:00:00.000Z',
      swingSession: false,
      trialLocation: 'Jacksonville, FL',
    },
  ];

  it('formats trial sessions correctly selecting startOfWeek and formatting start date', () => {
    const result = formatSession(TRIAL_SESSIONS_LIST[2], applicationContext);
    expect(result).toMatchObject({
      formattedStartDate: '11/27/19',
      judge: { name: '3', userId: '3' },
      startDate: '2019-11-27T15:00:00.000Z',
      startOfWeek: 'November 25, 2019',
    });
  });

  it('groups trial sessions into arrays according to session weeks', () => {
    const result = runCompute(formattedTrialSessions, {
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

  it('filter trial sessions', () => {
    const result = runCompute(formattedTrialSessions, {
      state: {
        screenMetadata: { trialSessionFilters: { judge: { userId: '1' } } },
        trialSessions: TRIAL_SESSIONS_LIST,
      },
    });
    expect(result.formattedSessions.length).toBe(1);
  });

  it('returns all trial sessions if judge userId trial session filter is an empty string', () => {
    const result = runCompute(formattedTrialSessions, {
      state: {
        screenMetadata: { trialSessionFilters: { judge: { userId: '' } } },
        trialSessions: TRIAL_SESSIONS_LIST,
      },
    });
    expect(result.formattedSessions.length).toBe(2);
  });

  it('shows swing session option only if matching term and term year is found', () => {
    const trialSessions = [
      {
        judge: { name: '1', userId: '1' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Fall',
        termYear: '2019',
        trialLocation: 'Denver, CO',
      },
      {
        judge: { name: '2', userId: '2' },
        startDate: '2019-04-25T15:00:00.000Z',
        term: 'Spring',
        termYear: '2019',
        trialLocation: 'Jacksonville, FL',
      },
    ];

    let form = {
      term: 'Winter',
      termYear: '2019',
    };
    let result = runCompute(formattedTrialSessions, {
      state: {
        form,
        trialSessions,
      },
    });
    expect(result.sessionsByTerm.length).toEqual(0);
    expect(result.showSwingSessionOption).toBeFalsy();

    form.term = 'Spring';
    result = runCompute(formattedTrialSessions, {
      state: {
        form,
        trialSessions,
      },
    });
    expect(result.sessionsByTerm.length).toEqual(1);
    expect(result.showSwingSessionOption).toBeTruthy();

    form.termYear = '2011'; // similar term but not a matching year
    result = runCompute(formattedTrialSessions, {
      state: {
        form,
        trialSessions,
      },
    });
    expect(result.sessionsByTerm.length).toEqual(0);
    expect(result.showSwingSessionOption).toBeFalsy();
  });

  it('returns sessionsByTerm with only sessions in that term if form.term is set', () => {
    const trialSessions = [
      {
        judge: { name: '1', userId: '1' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Denver, CO',
      },
      {
        judge: { name: '2', userId: '2' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Spring',
        trialLocation: 'Jacksonville, FL',
      },
      {
        judge: { name: '3', userId: '3' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Fall',
        trialLocation: 'Houston, TX',
      },
      {
        judge: { name: '4', userId: '4' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Birmingham, AL',
      },
      {
        judge: { name: '5', userId: '5' },
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Seattle, WA',
      },
    ];
    const result = runCompute(formattedTrialSessions, {
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
        judge: { name: '4', userId: '4' },
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Birmingham, AL',
      },
      {
        formattedStartDate: '11/25/19',
        judge: { name: '1', userId: '1' },
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Denver, CO',
      },
      {
        formattedStartDate: '11/25/19',
        judge: { name: '5', userId: '5' },
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Seattle, WA',
      },
    ]);
  });
});
