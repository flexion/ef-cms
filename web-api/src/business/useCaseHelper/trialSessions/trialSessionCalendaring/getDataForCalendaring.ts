import {
  PROCEDURE_TYPES_MAP,
  REGULAR_TRIAL_CITY_STRINGS,
  TRIAL_CITY_STRINGS,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import {
  WASHINGTON_DC_SOUTH_STRING,
  WASHINGTON_DC_STRING,
} from '@web-api/business/useCases/trialSessions/generateSuggestedTrialSessionCalendarInteractor';

export type EligibleCase = Pick<
  RawCase,
  'preferredTrialCity' | 'procedureType' | 'docketNumber'
>;

export type CaseCountByCity = Record<string, number>;

export const getDataForCalendaring = ({
  cases,
}: {
  cases: EligibleCase[];
  citiesFromLastTwoTerms: string[];
}): {
  initialSmallCaseCountsByCity: CaseCountByCity;
  initialRegularCaseCountsByCity: CaseCountByCity;
  incorrectSizeRegularCases: EligibleCase[];
} => {
  let {
    caseCountsByCity: initialRegularCaseCountsByCity,
    incorrectSizeCases: incorrectSizeRegularCases,
  } = getCasesByCity(cases, PROCEDURE_TYPES_MAP.regular);

  let { caseCountsByCity: initialSmallCaseCountsByCity } = getCasesByCity(
    cases,
    PROCEDURE_TYPES_MAP.small,
  );

  initialRegularCaseCountsByCity = TRIAL_CITY_STRINGS.reduce((acc, city) => {
    if (city === WASHINGTON_DC_STRING) {
      // We only schedule non-special sessions at DC South, so we only need to
      // worry about case counts for South.
      acc[WASHINGTON_DC_SOUTH_STRING] =
        initialRegularCaseCountsByCity[city] || 0;
    } else {
      acc[city] = initialRegularCaseCountsByCity[city] || 0;
    }
    return acc;
  }, {});

  initialSmallCaseCountsByCity = TRIAL_CITY_STRINGS.reduce((acc, city) => {
    if (city === WASHINGTON_DC_STRING) {
      acc[WASHINGTON_DC_SOUTH_STRING] = initialSmallCaseCountsByCity[city] || 0;
    } else {
      acc[city] = initialSmallCaseCountsByCity[city] || 0;
    }
    return acc;
  }, {});

  return {
    incorrectSizeRegularCases,
    initialRegularCaseCountsByCity,
    initialSmallCaseCountsByCity,
  };
};

function getCasesByCity(
  cases: EligibleCase[],
  type: TrialSessionTypes,
): {
  incorrectSizeCases: EligibleCase[];
  caseCountsByCity: CaseCountByCity;
} {
  const incorrectSizeCases: EligibleCase[] = [];
  const caseCountsByCity: CaseCountByCity = {};

  cases
    .filter(c => c.procedureType === type)
    .forEach(currentCase => {
      if (
        type === PROCEDURE_TYPES_MAP.regular &&
        !REGULAR_TRIAL_CITY_STRINGS.includes(currentCase.preferredTrialCity!)
      ) {
        incorrectSizeCases.push(currentCase);
      }

      if (!caseCountsByCity[currentCase.preferredTrialCity!]) {
        caseCountsByCity[currentCase.preferredTrialCity!] = 0;
      }

      caseCountsByCity[currentCase.preferredTrialCity!]++;
    });

  return { caseCountsByCity, incorrectSizeCases };
}
