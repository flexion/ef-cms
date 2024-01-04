import { RawCalendaredCase } from '@shared/business/entities/cases/CalendaredCase';
import { RawEligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  SESSION_STATUS_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';

export type CalendaredCaseItemType = (RawCase | RawCalendaredCase) & {
  removedFromTrial?: boolean;
  removedFromTrialDate?: string;
};

export type TrialSessionState = RawTrialSession & {
  calendaredCases?: CalendaredCaseItemType[];
  eligibleCases?: RawEligibleCase[];
  swingSessionLocation?: string;
};

export const initialTrialSessionState: TrialSessionState = {
  calendaredCases: [],
  caseOrder: [],
  eligibleCases: [],
  entityName: 'TrialSession',
  hasNOTTBeenServed: false,
  isCalendared: false,
  judge: {
    name: '',
    userId: '',
  },
  maxCases: 100,
  proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
  sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
  sessionStatus: SESSION_STATUS_TYPES.open,
  sessionType: '',
  startDate: '',
  term: '',
  termYear: '',
  trialLocation: '',
  trialSessionId: '',
};
