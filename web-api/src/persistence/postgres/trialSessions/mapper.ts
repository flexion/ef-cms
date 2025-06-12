/* eslint-disable complexity */
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { formatNow } from '@shared/business/utilities/DateHandler';

export const toKyselyNewTrialSession = (raw: RawTrialSession) => {
  return {
    address1: raw.address1 ?? null,
    address2: raw.address2 ?? null,
    alternateTrialClerkName: raw.alternateTrialClerkName ?? null,
    caseOrder: JSON.stringify(raw.caseOrder ?? []),
    chambersPhoneNumber: raw.chambersPhoneNumber ?? null,
    city: raw.city ?? null,
    courthouseName: raw.courthouseName ?? null,
    courtReporter: raw.courtReporter ?? null,
    createdAt: raw.createdAt ?? formatNow(),
    dismissedAlertForNOTT: raw.dismissedAlertForNOTT ?? null,
    hasNOTTBeenServed: raw.hasNOTTBeenServed,
    estimatedEndDate: raw.estimatedEndDate ?? null,
    irsCalendarAdministrator: raw.irsCalendarAdministrator ?? null,
    irsCalendarAdministratorInfo: JSON.stringify(
      raw.irsCalendarAdministratorInfo ?? null,
    ),
    isCalendared: raw.isCalendared,
    joinPhoneNumber: raw.joinPhoneNumber ?? null,
    judge: JSON.stringify(raw.judge ?? null),
    maxCases: raw.maxCases ?? null,
    meetingId: raw.meetingId ?? null,
    notes: raw.notes ?? null,
    noticeIssuedDate: raw.noticeIssuedDate ?? null,
    password: raw.password ?? null,
    postalCode: raw.postalCode ?? null,
    proceedingType: raw.proceedingType,
    sessionScope: raw.sessionScope,
    sessionStatus: raw.sessionStatus,
    sessionType: raw.sessionType,
    startDate: raw.startDate,
    startTime: raw.startTime ?? null,
    state: raw.state ?? null,
    swingSession: raw.swingSession ?? null,
    swingSessionId: raw.swingSessionId ?? null,
    term: raw.term,
    termYear: raw.termYear,
    trialClerk: JSON.stringify(raw.trialClerk ?? null),
    trialLocation: raw.trialLocation ?? null,
    trialSessionId: raw.trialSessionId,
    paperServicePdfs: JSON.stringify(raw.paperServicePdfs ?? []),
  };
};
