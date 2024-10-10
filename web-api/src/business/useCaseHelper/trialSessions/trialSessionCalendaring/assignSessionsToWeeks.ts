import {
  CalendaringConfig,
  ProspectiveSessionsByCity,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/createProspectiveTrialSessions';
import {
  FORMATS,
  createDateAtStartOfWeekEST,
} from '@shared/business/utilities/DateHandler';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TRIAL_CITY_STRINGS,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import {
  WASHINGTON_DC_NORTH_STRING,
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

export type ScheduledTrialSession = {
  city: string;
  sessionType: TrialSessionTypes;
  weekOf: string;
};

export type SessionCountByWeek = Record<string, number>;

export type TrialSessionsByCity = Record<string, ScheduledTrialSession[]>;

export const assignSessionsToWeeks = ({
  calendaringConfig,
  prospectiveSessionsByCity,
  specialSessions,
  weeksToLoop,
}: {
  specialSessions: RawTrialSession[];
  prospectiveSessionsByCity: ProspectiveSessionsByCity;
  weeksToLoop: string[];
  calendaringConfig: CalendaringConfig;
}): {
  sessionCountPerWeek: SessionCountByWeek;
  scheduledTrialSessionsByCity: TrialSessionsByCity;
} => {
  const sessionCountPerWeek: Record<string, number> = {}; // weekOf -> session count
  const sessionCountPerCity: Record<string, number> = {}; // trialLocation -> session count
  const sessionScheduledPerCityPerWeek: Record<string, Set<string>> = {}; // weekOf -> Set of cities
  //   -- Prioritize overridden and special sessions that have already been scheduled
  // -- Max 1 per location per week.
  // -- Max x per week across all locations

  const scheduledTrialSessionsByCity: TrialSessionsByCity = {};
  TRIAL_CITY_STRINGS.forEach(cityStringKey => {
    if (cityStringKey === WASHINGTON_DC_STRING) {
      sessionCountPerCity[WASHINGTON_DC_NORTH_STRING] = 0;
      scheduledTrialSessionsByCity[WASHINGTON_DC_NORTH_STRING] = [];
      sessionCountPerCity[WASHINGTON_DC_SOUTH_STRING] = 0;
      scheduledTrialSessionsByCity[WASHINGTON_DC_SOUTH_STRING] = [];
    } else {
      sessionCountPerCity[cityStringKey] = 0;
      scheduledTrialSessionsByCity[cityStringKey] = [];
    }
  });

  weeksToLoop.forEach(weekOfString => {
    if (!sessionCountPerWeek[weekOfString]) {
      sessionCountPerWeek[weekOfString] = 0;
    }

    if (!sessionScheduledPerCityPerWeek[weekOfString]) {
      sessionScheduledPerCityPerWeek[weekOfString] = new Set();
    }
  });

  // check special sessions
  const specialSessionsByLocation = specialSessions.reduce((acc, session) => {
    if (!acc[session.trialLocation!]) {
      acc[session.trialLocation!] = [];
    }
    acc[session.trialLocation!].push(session);
    return acc;
  }, {});

  for (const location in specialSessionsByLocation) {
    if (
      specialSessionsByLocation[location].length >
      calendaringConfig.maxSessionsPerLocation
    ) {
      throw new Error(
        `Special session count exceeds the max sessions per location for ${location}`,
      );
    }
  }

  // TODO 10275: test this (and be sure it works)
  const sortedProspectiveSessionsByCity = Object.keys(prospectiveSessionsByCity)
    .sort((a, b) => {
      const aNotVisited =
        prospectiveSessionsByCity[a][0]?.cityWasNotVisitedInLastTwoTerms ||
        false;
      const bNotVisited =
        prospectiveSessionsByCity[b][0]?.cityWasNotVisitedInLastTwoTerms ||
        false;

      return aNotVisited === bNotVisited ? 0 : aNotVisited ? -1 : 1;
    })
    .reduce((obj, key) => {
      if (key === WASHINGTON_DC_STRING) {
        obj[WASHINGTON_DC_SOUTH_STRING] = [];

        for (const prospectiveSession of prospectiveSessionsByCity[key]) {
          obj[WASHINGTON_DC_SOUTH_STRING].push({
            ...prospectiveSession,
            city: WASHINGTON_DC_SOUTH_STRING,
          });
        }

        return obj;
      }
      obj[key] = prospectiveSessionsByCity[key];
      return obj;
    }, {});

  // special sessions handled ahead of all reg, small

  specialSessions.forEach(session => {
    const sessionWeekOf = createDateAtStartOfWeekEST(
      session.startDate,
      FORMATS.YYYYMMDD,
    );
    let trialLocation = session.trialLocation!;

    if (
      sessionCountPerWeek[sessionWeekOf] >= calendaringConfig.maxSessionsPerWeek
    ) {
      throw new Error(
        `Specials sessions for week of ${sessionWeekOf} exceed maximum sessions allowed per week`,
      );
    }

    if (sessionScheduledPerCityPerWeek[sessionWeekOf].has(trialLocation)) {
      throw new Error(
        'There must only be one special trial session per location per week.',
      );
    }

    if (session.trialLocation === WASHINGTON_DC_STRING) {
      if (
        sessionCountPerCity[WASHINGTON_DC_NORTH_STRING] >=
          calendaringConfig.maxSessionsPerLocation ||
        sessionScheduledPerCityPerWeek[sessionWeekOf].has(
          WASHINGTON_DC_NORTH_STRING,
        )
      ) {
        if (
          sessionCountPerCity[WASHINGTON_DC_SOUTH_STRING] >=
          calendaringConfig.maxSessionsPerLocation
        ) {
          throw new Error(
            `Special sessions in ${WASHINGTON_DC_STRING} exceed the maximum allowed`,
          );
        } else if (
          sessionScheduledPerCityPerWeek[sessionWeekOf].has(
            WASHINGTON_DC_SOUTH_STRING,
          )
        ) {
          throw new Error(
            'There must be no more than two special trial sessions per week in Washington, DC.',
          );
        } else {
          trialLocation = WASHINGTON_DC_SOUTH_STRING;
        }
      } else {
        trialLocation = WASHINGTON_DC_NORTH_STRING;
      }
    }

    addScheduledTrialSession({
      city: trialLocation,
      scheduledTrialSessionsByCity,
      sessionCountPerCity,
      sessionCountPerWeek,
      sessionScheduledPerCityPerWeek,
      sessionType: SESSION_TYPES.special,
      weekOfString: sessionWeekOf,
    });
  });

  for (const currentWeek of weeksToLoop) {
    const weekOfString = currentWeek;
    for (const city in sortedProspectiveSessionsByCity) {
      // This is a redundant check, as we expect the length of the array to have
      // already been trimmed to at most the max before entering this function.
      // since we ignore things beyond the max, force prospective array to at most the max
      if (
        sessionCountPerCity[city] >= calendaringConfig.maxSessionsPerLocation
      ) {
        continue;
      }

      // Check if we're already at the max for this location
      // Just use the first session!?
      for (const prospectiveSession of sortedProspectiveSessionsByCity[city]) {
        if (
          sessionScheduledPerCityPerWeek[weekOfString].has(
            prospectiveSession.city,
          ) ||
          sessionCountPerWeek[weekOfString] >=
            calendaringConfig.maxSessionsPerWeek
        ) {
          break; // Skip this city if a session is already scheduled for this week (must allow at most one in this loop)
        }

        addScheduledTrialSession({
          ...prospectiveSession,
          scheduledTrialSessionsByCity,
          sessionCountPerCity,
          sessionCountPerWeek,
          sessionScheduledPerCityPerWeek,
          weekOfString,
        });

        const index =
          sortedProspectiveSessionsByCity[city].indexOf(prospectiveSession);

        if (index !== -1) {
          sortedProspectiveSessionsByCity[city].splice(index, 1);
        }
      }
    }
  }

  return {
    scheduledTrialSessionsByCity,
    sessionCountPerWeek,
  };
};

function addScheduledTrialSession({
  city,
  scheduledTrialSessionsByCity,
  sessionCountPerCity,
  sessionCountPerWeek,
  sessionScheduledPerCityPerWeek,
  sessionType,
  weekOfString,
}: {
  city: string;
  scheduledTrialSessionsByCity: Record<string, ScheduledTrialSession[]>;
  sessionCountPerCity: Record<string, number>;
  sessionCountPerWeek: Record<string, number>;
  sessionScheduledPerCityPerWeek: Record<string, Set<string>>;
  sessionType: TrialSessionTypes;
  weekOfString: string;
}) {
  scheduledTrialSessionsByCity[city].push({
    city,
    sessionType,
    weekOf: weekOfString,
  });

  sessionCountPerWeek[weekOfString]++;
  sessionCountPerCity[city]++;
  sessionScheduledPerCityPerWeek[weekOfString].add(city); // Mark this city as scheduled for the current week
}
