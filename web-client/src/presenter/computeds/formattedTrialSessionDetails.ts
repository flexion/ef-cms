import { isEmpty, isEqual } from 'lodash';
import { set30DayNoticeOfTrialReminder } from './utilities/set30DayNoticeOfTrialReminder';
import { state } from 'cerebral';

export const formattedTrialSessionDetails = (get, applicationContext) => {
  const trialSession = get(state.trialSession);
  const listOfBanners = get(state.listOfBanners);
  const hasNOTTBannerBeenDismissed = listOfBanners[trialSession.trialSessionId];

  const formattedTrialSession = applicationContext
    .getUtilities()
    .getFormattedTrialSessionDetails({
      applicationContext,
      trialSession,
    });

  if (formattedTrialSession) {
    const {
      DATE_FORMATS,
      HYBRID_SESSION_TYPES,
      SESSION_STATUS_GROUPS,
      SESSION_STATUS_TYPES,
      TRIAL_SESSION_SCOPE_TYPES,
      USER_ROLES,
    } = applicationContext.getConstants();

    formattedTrialSession.showOpenCases =
      formattedTrialSession.sessionStatus === SESSION_STATUS_GROUPS.open;
    formattedTrialSession.showOnlyClosedCases =
      formattedTrialSession.sessionStatus === SESSION_STATUS_GROUPS.closed;

    if (formattedTrialSession.chambersPhoneNumber) {
      formattedTrialSession.chambersPhoneNumber = applicationContext
        .getUtilities()
        .formatPhoneNumber(formattedTrialSession.chambersPhoneNumber);
    }

    formattedTrialSession.isHybridSession = Object.values(
      HYBRID_SESSION_TYPES,
    ).includes(formattedTrialSession.sessionType);

    formattedTrialSession.disableHybridFilter =
      (formattedTrialSession.eligibleCases ?? []).length === 0;

    if (formattedTrialSession.startDate) {
      const trialDateFormatted = applicationContext
        .getUtilities()
        .formatDateString(formattedTrialSession.startDate);
      const nowDateFormatted = applicationContext
        .getUtilities()
        .formatNow(DATE_FORMATS.YYYYMMDD);

      const user = applicationContext.getCurrentUser();
      const isChambersUser = user.role === USER_ROLES.chambers;

      const trialDateInFuture = trialDateFormatted > nowDateFormatted;
      formattedTrialSession.canDelete =
        trialDateInFuture && !formattedTrialSession.isCalendared;
      formattedTrialSession.canEdit =
        trialDateInFuture &&
        formattedTrialSession.sessionStatus !== SESSION_STATUS_GROUPS.closed &&
        !isChambersUser;

      const allCases = formattedTrialSession.caseOrder || [];
      const inactiveCases = allCases.filter(
        sessionCase => sessionCase.removedFromTrial === true,
      );
      const hasNoActiveCases =
        isEmpty(allCases) || isEqual(allCases, inactiveCases);

      if (
        !hasNOTTBannerBeenDismissed &&
        formattedTrialSession.isCalendared &&
        formattedTrialSession.formattedStartDate
      ) {
        const {
          isCurrentDateWithinReminderRange,
          thirtyDaysBeforeTrialFormatted,
        } = set30DayNoticeOfTrialReminder({
          applicationContext,
          trialStartDate: formattedTrialSession.formattedStartDate,
        });

        formattedTrialSession.showAlertForNOTTReminder =
          isCurrentDateWithinReminderRange;
        formattedTrialSession.alertMessageForNOTT = `30-day trial notices are due before ${thirtyDaysBeforeTrialFormatted}. Have notices been served?`;
      }

      if (
        hasNoActiveCases &&
        !trialDateInFuture &&
        formattedTrialSession.sessionScope ===
          TRIAL_SESSION_SCOPE_TYPES.standaloneRemote &&
        formattedTrialSession.sessionStatus !== SESSION_STATUS_TYPES.closed
      ) {
        formattedTrialSession.canClose = true;
      }
    }
  }

  return formattedTrialSession;
};
