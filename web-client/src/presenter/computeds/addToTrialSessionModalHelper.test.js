import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

import { addToTrialSessionModalHelper as addToTrialSessionModalHelperComputed } from './addToTrialSessionModalHelper';

const addToTrialSessionModalHelper = withAppContextDecorator(
  addToTrialSessionModalHelperComputed,
);

describe('add to trial session modal helper', () => {
  const trialSessions = [
    {
      sessionType: 'Small',
      startDate: '2019-05-01T21:40:46.415Z',
      status: 'Upcoming',
      trialLocation: 'Boise, Idaho',
      trialSessionId: '4',
    },
    {
      sessionType: 'Regular',
      startDate: '2019-03-01T21:40:46.415Z',
      status: 'Upcoming',
      trialLocation: 'Birmingham, Alabama',
      trialSessionId: '1',
    },
    {
      sessionType: 'Hybrid',
      startDate: '2018-02-01T21:40:46.415Z',
      status: 'Upcoming',
      trialLocation: 'Mobile, Alabama',
      trialSessionId: '2',
    },
    {
      sessionType: 'Special',
      startDate: '2019-01-01T21:40:46.415Z',
      status: 'Upcoming',
      trialLocation: 'Birmingham, Alabama',
      trialSessionId: '3',
    },
    {
      sessionType: 'Motion/Hearing',
      startDate: '2018-12-01T21:40:46.415Z',
      status: 'Upcoming',
      trialLocation: 'Mobile, Alabama',
      trialSessionId: '5',
    },
  ];

  it('should not return trialSessionsFormatted or trialSessionsFormattedByState if modal state does not contain trialSessions', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: {},
        form: {},
        modal: {},
      },
    });

    expect(result.trialSessionsFormatted).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toBeFalsy();
  });

  it('should filter out trial sessions that do not have the status Upcoming', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { preferredTrialCity: 'Birmingham, Alabama' },
        form: {},
        modal: {
          showAllLocations: true,
          trialSessions: [
            ...trialSessions,
            {
              status: 'Closed',
              trialLocation: 'Nashville, Tennessee',
              trialSessionId: '6',
            },
          ],
        },
      },
    });

    expect(result.trialSessionsFormatted).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toMatchObject({
      Alabama: [
        {
          trialSessionId: '3',
        },
        {
          trialSessionId: '1',
        },
        {
          trialSessionId: '2',
        },
        {
          trialSessionId: '5',
        },
      ],
      Idaho: [
        {
          trialSessionId: '4',
        },
      ],
    });
  });

  it('should filter trialSessions by preferredTrialCity if state.modal.showAllLocations is false', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { preferredTrialCity: 'Birmingham, Alabama' },
        form: {},
        modal: {
          showAllLocations: false,
          trialSessions,
        },
      },
    });

    expect(result.trialSessionsFormattedByState).toBeFalsy();
    expect(result.trialSessionsFormatted.length).toEqual(2);
    expect(result.trialSessionsFormatted).toMatchObject([
      { trialLocation: 'Birmingham, Alabama' },
      { trialLocation: 'Birmingham, Alabama' },
    ]);
  });

  it('should format optionText for each trial session and group by state, then sort by location and then by date when showAllLocations is true', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { preferredTrialCity: 'Birmingham, Alabama' },
        form: {},
        modal: {
          showAllLocations: true,
          trialSessions,
        },
      },
    });

    expect(result.trialSessionsFormatted).toBeFalsy();
    expect(result.trialSessionsFormattedByState).toMatchObject({
      Alabama: [
        {
          optionText: 'Birmingham, Alabama 01/01/19 (SP)',
          trialLocationState: 'Alabama',
          trialSessionId: '3',
        },
        {
          optionText: 'Birmingham, Alabama 03/01/19 (R)',
          trialSessionId: '1',
        },
        {
          optionText: 'Mobile, Alabama 02/01/18 (H)',
          trialSessionId: '2',
        },
        {
          optionText: 'Mobile, Alabama 12/01/18 (M/H)',
          trialSessionId: '5',
        },
      ],
      Idaho: [
        {
          optionText: 'Boise, Idaho 05/01/19 (S)',
          trialSessionId: '4',
        },
      ],
    });
    expect(result.trialSessionStatesSorted).toEqual(['Alabama', 'Idaho']);
  });

  it('should format optionText for each trial session and sort by date when showAllLocations is false', () => {
    const result = runCompute(addToTrialSessionModalHelper, {
      state: {
        caseDetail: { preferredTrialCity: 'Birmingham, Alabama' },
        form: {},
        modal: {
          showAllLocations: false,
          trialSessions,
        },
      },
    });

    expect(result.trialSessionsFormattedByState).toBeFalsy();
    expect(result.trialSessionsFormatted.length).toEqual(2);
    expect(result.trialSessionsFormatted).toMatchObject([
      {
        optionText: 'Birmingham, Alabama 01/01/19 (SP)',
        trialSessionId: '3',
      },
      {
        optionText: 'Birmingham, Alabama 03/01/19 (R)',
        trialSessionId: '1',
      },
    ]);
  });
});
