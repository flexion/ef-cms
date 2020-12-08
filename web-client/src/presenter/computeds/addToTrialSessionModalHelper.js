import { formatTrialSessionsForHelper } from './setForHearingModalHelper';
import { sortBy } from 'lodash';
import { state } from 'cerebral';

export const addToTrialSessionModalHelper = (get, applicationContext) => {
  const { SESSION_STATUS_GROUPS } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const { showAllLocations, trialSessionId, trialSessions } = get(state.modal);

  const selectedTrialSession =
    trialSessions &&
    trialSessions.find(session => session.trialSessionId === trialSessionId);

  let trialSessionsFormatted = trialSessions;
  let trialSessionsFormattedByState = null;
  let trialSessionStatesSorted = null;
  if (trialSessionsFormatted) {
    trialSessionsFormatted = formatTrialSessionsForHelper(
      trialSessionsFormatted,
      applicationContext,
    ).filter(trialSession =>
      [SESSION_STATUS_GROUPS.new, SESSION_STATUS_GROUPS.open].includes(
        trialSession.computedStatus,
      ),
    );

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
        trialSessionsFormattedByState[
          stateName
        ] = sortBy(trialSessionsFormattedByState[stateName], [
          'trialLocation',
          'startDate',
        ]);
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
    showSessionNotSetAlert: !!(
      selectedTrialSession && selectedTrialSession.isCalendared === false
    ),
    trialSessionStatesSorted,
    trialSessionsFormatted,
    trialSessionsFormattedByState,
  };
};
