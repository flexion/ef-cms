import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { assignSessionsToWeeks } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import { getUniqueId } from '@shared/sharedAppContext';
// import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';

// const mockSpecialSessions = [];
const defaultMockCalendaringConfig = {
  hybridCaseMaxQuantity: 10,
  hybridCaseMinimumQuantity: 5,
  maxSessionsPerLocation: 5, // Note that we may need to rethink this and maxSessionsPerWeek for testing purposes
  maxSessionsPerWeek: 6,
  regularCaseMaxQuantity: 10,
  regularCaseMinimumQuantity: 4,
  smallCaseMaxQuantity: 13,
  smallCaseMinimumQuantity: 4,
};

const mockEndDate = '2019-10-10T04:00:00.000Z';
const mockStartDate = '2019-08-22T04:00:00.000Z';

function getMockTrialSessions() {
  const mockSessions: Record<
    string,
    {
      city: string;
      sessionType: TrialSessionTypes;
    }[]
  > = {};

  const numberOfSessions = defaultMockCalendaringConfig.maxSessionsPerWeek + 1;

  for (let i = 0; i < numberOfSessions; ++i) {
    mockSessions[TRIAL_CITY_STRINGS[i]] = [
      {
        city: `${TRIAL_CITY_STRINGS[i]}`,
        sessionType: SESSION_TYPES.regular,
      },
    ];
  }

  return mockSessions;
}

function getMockTrialSessionsForSingleCity() {
  const mockSessions: Record<
    string,
    {
      city: string;
      sessionType: TrialSessionTypes;
    }[]
  > = {};

  const numberOfSessions =
    defaultMockCalendaringConfig.maxSessionsPerLocation + 1;

  for (let i = 0; i < numberOfSessions; ++i) {
    if (!mockSessions[TRIAL_CITY_STRINGS[0]]) {
      mockSessions[TRIAL_CITY_STRINGS[0]] = [];
    }
    mockSessions[TRIAL_CITY_STRINGS[0]].push({
      city: `${TRIAL_CITY_STRINGS[0]}`,
      sessionType: SESSION_TYPES.regular,
    });
  }
  return mockSessions;
}

describe('assignSessionsToWeeks', () => {
  it('should not schedule more than the maximum number of sessions for a given week', () => {
    const mockSessions = getMockTrialSessions();

    const result = assignSessionsToWeeks({
      calendaringConfig: defaultMockCalendaringConfig,
      endDate: mockEndDate,
      prospectiveSessionsByCity: mockSessions,
      specialSessions: [],
      startDate: mockStartDate,
    });

    //TODO: refactor this
    const weekOfMap = result.reduce((acc, session) => {
      acc[session.weekOf] = (acc[session.weekOf] || 0) + 1;
      return acc;
    }, {});

    expect(Object.values(weekOfMap)[0]).toEqual(
      defaultMockCalendaringConfig.maxSessionsPerWeek,
    );
  });

  it('should assign no more than the max number of sessions per location when passed more than the max for a given location', () => {
    const mockSessions = getMockTrialSessionsForSingleCity();
    console.log('mockSessions', mockSessions);
    const result = assignSessionsToWeeks({
      calendaringConfig: defaultMockCalendaringConfig,
      endDate: mockEndDate,
      prospectiveSessionsByCity: mockSessions,
      specialSessions: [],
      startDate: mockStartDate,
    });

    //TODO: refactor this
    // const weekOfMap = result.reduce((acc, session) => {
    //   acc[session.weekOf] = (acc[session.weekOf] || 0) + 1;
    //   return acc;
    // }, {});
    console.log('result', result);
    console.log('typeof result', typeof result);

    expect(result.length).toEqual(
      defaultMockCalendaringConfig.maxSessionsPerLocation,
    );
  });

  it.only('should prioritize special sessions over non-special sessions', () => {
    const mockSpecialSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-22T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-05T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-12T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-19T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-09-26T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
    ];

    const mockSessions = getMockTrialSessionsForSingleCity();
    const result = assignSessionsToWeeks({
      calendaringConfig: defaultMockCalendaringConfig,
      endDate: mockEndDate,
      prospectiveSessionsByCity: mockSessions,
      specialSessions: mockSpecialSessions,
      startDate: mockStartDate,
    });

    expect(result.length).toEqual(mockSpecialSessions.length);

    // 5 special sessions at the same location
    // 1 non-special session also at that same location
    // in the end, we should have 5 special sessions scheduled for that location and that's it
  });

  it('should throw an error when passed multiple special sections in the same location for the same week', () => {
    const mockSpecialSessions = [
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
      {
        ...MOCK_TRIAL_REGULAR,
        sessionType: SESSION_TYPES.special,
        startDate: '2019-08-29T04:00:00.000Z',
        trialLocation: TRIAL_CITY_STRINGS[0],
        trialSessionId: getUniqueId(),
      },
    ];

    const mockSessions = getMockTrialSessionsForSingleCity();

    expect(() => {
      assignSessionsToWeeks({
        calendaringConfig: defaultMockCalendaringConfig,
        endDate: mockEndDate,
        prospectiveSessionsByCity: mockSessions,
        specialSessions: mockSpecialSessions,
        startDate: mockStartDate,
      });
    }).toThrow(Error);
  });
  // 5 special sessions, all at different locations, in the same week
  // 2 non-special sessions, all at different locations, in the same week
  // in the end, we should have 5 special and 1 non-special scheduled for that week
});
