import { sortBy } from 'lodash';
import { state } from 'cerebral';

export const addToTrialSessionModalHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const modalState = get(state.modal);

  let trialSessionsFormatted = modalState && modalState.trialSessions;
  let trialSessionsFormattedByState = null;
  let trialSessionStatesSorted = null;
  if (trialSessionsFormatted) {
    const showAllLocations = modalState && modalState.showAllLocations;

    trialSessionsFormatted = trialSessionsFormatted
      .filter(trialSession => trialSession.status === 'Upcoming')
      .map(trialSession => {
        trialSession.startDateFormatted = applicationContext
          .getUtilities()
          .formatDateString(trialSession.startDate, 'MMDDYY');
        switch (trialSession.sessionType) {
          case 'Regular':
          case 'Small':
          case 'Hybrid':
            trialSession.sessionTypeFormatted = trialSession.sessionType.charAt(
              0,
            );
            break;
          case 'Special':
            trialSession.sessionTypeFormatted = 'SP';
            break;
          case 'Motion/Hearing':
            trialSession.sessionTypeFormatted = 'M/H';
            break;
        }
        trialSession.optionText = `${trialSession.trialLocation} ${trialSession.startDateFormatted} (${trialSession.sessionTypeFormatted})`;
        return trialSession;
      });

    if (showAllLocations) {
      trialSessionsFormatted.forEach(
        trialSession =>
          (trialSession.trialLocationState = trialSession.trialLocation.split(
            ', ',
          )[1]),
      );

      trialSessionsFormattedByState = {};
      trialSessionsFormatted.forEach(
        trialSession =>
          (trialSessionsFormattedByState[trialSession.trialLocationState] = [
            ...(trialSessionsFormattedByState[
              trialSession.trialLocationState
            ] || []),
            trialSession,
          ]),
      );

      trialSessionStatesSorted = Object.keys(
        trialSessionsFormattedByState,
      ).sort();

      trialSessionStatesSorted.forEach(stateName => {
        trialSessionsFormattedByState[stateName] = sortBy(
          trialSessionsFormattedByState[stateName],
          ['trialLocation', 'startDate'],
        );
      });
      trialSessionsFormatted = null;
    } else {
      trialSessionsFormatted = trialSessionsFormatted.filter(
        trialSession =>
          trialSession.trialLocation === caseDetail.preferredTrialCity,
      );
      trialSessionsFormatted = sortBy(trialSessionsFormatted, 'startDate');
    }
  }

  return {
    trialSessionStatesSorted,
    trialSessionsFormatted,
    trialSessionsFormattedByState,
  };
};
