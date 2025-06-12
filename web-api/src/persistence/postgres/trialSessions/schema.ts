import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const trialSessionsTableDefinition = {
  address1: DEFAULT as string | null,
  address2: DEFAULT as string | null,
  alternateTrialClerkName: DEFAULT as string | null,
  caseOrder: DEFAULT as string,
  chambersPhoneNumber: DEFAULT as string | null,
  city: DEFAULT as string | null,
  courthouseName: DEFAULT as string | null,
  courtReporter: DEFAULT as string | null,
  createdAt: DEFAULT as string | null,
  dismissedAlertForNOTT: DEFAULT as boolean | null,
  hasNOTTBeenServed: DEFAULT as boolean,
  estimatedEndDate: DEFAULT as string | null,
  irsCalendarAdministrator: DEFAULT as string | null,
  irsCalendarAdministratorInfo: DEFAULT as string | null,
  isCalendared: DEFAULT as boolean,
  joinPhoneNumber: DEFAULT as string | null,
  judge: DEFAULT as string | null,
  maxCases: DEFAULT as number | null,
  meetingId: DEFAULT as string | null,
  notes: DEFAULT as string | null,
  noticeIssuedDate: DEFAULT as string | null,
  password: DEFAULT as string | null,
  postalCode: DEFAULT as string | null,
  proceedingType: DEFAULT as string,
  sessionScope: DEFAULT as string,
  sessionStatus: DEFAULT as string,
  sessionType: DEFAULT as string,
  startDate: DEFAULT as string,
  startTime: DEFAULT as string | null,
  state: DEFAULT as string | null,
  swingSession: DEFAULT as boolean | null,
  swingSessionId: DEFAULT as string | null,
  term: DEFAULT as string,
  termYear: DEFAULT as string,
  trialClerk: DEFAULT as string | null,
  trialLocation: DEFAULT as string | null,
  trialSessionId: DEFAULT as string,
  paperServicePdfs: DEFAULT as string,
};

export type TrialSessionTable = typeof trialSessionsTableDefinition;

export const DW_TRIAL_SESSION_COLUMNS = Object.keys(
  trialSessionsTableDefinition,
) as Array<keyof TrialSessionTable>;

export type TrialSessionKysely = Selectable<TrialSessionTable>;
export type NewTrialSessionKysely = Insertable<TrialSessionTable>;
export type UpdateTrialSessionKysely = Updateable<TrialSessionTable>;
