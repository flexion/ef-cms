import {
  FORMATS,
  createDateAtStartOfWeekEST,
  getWeeksInRange,
} from '@shared/business/utilities/DateHandler';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_TYPES,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';

export const assignSessionsToWeeks = ({
  calendaringConfig,
  endDate,
  prospectiveSessionsByCity,
  specialSessions,
  startDate,
}: {
  specialSessions: RawTrialSession[];
  prospectiveSessionsByCity: Record<
    string,
    {
      city: string;
      sessionType: TrialSessionTypes;
    }[]
  >;
  endDate: string;
  startDate: string;
  calendaringConfig: {
    maxSessionsPerWeek: number;
    maxSessionsPerLocation: number;
    regularCaseMinimumQuantity: number;
    regularCaseMaxQuantity: number;
    smallCaseMinimumQuantity: number;
    smallCaseMaxQuantity: number;
    hybridCaseMaxQuantity: number;
    hybridCaseMinimumQuantity: number;
  };
}): {
  city: string;
  sessionType: TrialSessionTypes;
  weekOf: string;
}[] => {
  const sessionCountPerWeek: Record<string, number> = {}; // weekOf -> session count
  const sessionScheduledPerCityPerWeek: Record<string, Set<string>> = {}; // weekOf -> Set of cities
  //   -- Prioritize overridden and special sessions that have already been scheduled
  // -- Max 1 per location per week.
  // -- Max x per week across all locations

  const scheduledSessions: {
    city: string;
    sessionType: TrialSessionTypes;
    weekOf: string;
  }[] = [];
  // Get array of weeks in range to loop through
  const weeksToLoop = getWeeksInRange({ endDate, startDate });

  for (const currentWeek of weeksToLoop) {
    const weekOfString = currentWeek;

    if (!sessionCountPerWeek[weekOfString]) {
      sessionCountPerWeek[weekOfString] = 0;
    }

    if (!sessionScheduledPerCityPerWeek[weekOfString]) {
      sessionScheduledPerCityPerWeek[weekOfString] = new Set();
    }

    const specialSessionsForWeek = specialSessions.filter(s => {
      return (
        createDateAtStartOfWeekEST(s.startDate, FORMATS.YYYYMMDD) ===
        weekOfString
      );
    });

    const specialSessionsByLocation = specialSessionsForWeek.reduce(
      (acc, session) => {
        if (!acc[session.trialLocation!]) {
          acc[session.trialLocation!] = [];
        }
        acc[session.trialLocation!].push(session);
        return acc;
      },
      {},
    );

    for (const location in specialSessionsByLocation) {
      if (specialSessionsByLocation[location].length > 1) {
        throw new Error(
          'There must only be one special trial session per location per week.',
        );
      }
    }

    specialSessionsForWeek.forEach(session => {
      addScheduledTrialSession({
        city: session.trialLocation,
        scheduledSessions,
        sessionCountPerWeek,
        sessionScheduledPerCityPerWeek,
        sessionType: SESSION_TYPES.special,
        weekOfString,
      });
    });

    for (const city in prospectiveSessionsByCity) {
      // This is a redundant check, as we expect the length of the array to have
      // already been trimmed to at most the max before entering this function.
      // TODO lets reeval whether we need or how to do this check
      // if (
      //   prospectiveSessionsByCity[city].length <
      //   calendaringConfig.maxSessionsPerLocation
      // ) {
      //   continue;
      // }

      if (weeksToLoop.indexOf(currentWeek) === 0) {
        // TODO currently, this will incorrectly ignore special sessions beyond the max for the location
        // we need to figure out a way to fix this.
        prospectiveSessionsByCity[city].unshift(
          specialSessionsByLocation[city],
        );
        // since we ignore things beyond the max, force prospective array to at most the max
        prospectiveSessionsByCity[city] = prospectiveSessionsByCity[
          city
        ].splice(0, calendaringConfig.maxSessionsPerLocation);
      }

      // Just use the first session!
      for (const prospectiveSession of prospectiveSessionsByCity[city]) {
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
          scheduledSessions,
          sessionCountPerWeek,
          sessionScheduledPerCityPerWeek,
          weekOfString,
        });

        const index =
          prospectiveSessionsByCity[city].indexOf(prospectiveSession);
        if (index !== -1) {
          prospectiveSessionsByCity[city].splice(index, 1);
        }
      }
    }
  }

  return scheduledSessions;
};

function addScheduledTrialSession({
  city,
  scheduledSessions,
  sessionCountPerWeek,
  sessionScheduledPerCityPerWeek,
  sessionType,
  weekOfString,
}) {
  scheduledSessions.push({
    city,
    sessionType,
    weekOf: weekOfString,
  });
  sessionCountPerWeek[weekOfString]++;
  sessionScheduledPerCityPerWeek[weekOfString].add(city); // Mark this city as scheduled for the current week
}
