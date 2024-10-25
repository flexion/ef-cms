import { ExtendedTrialSessionInfoDTO } from '@web-client/presenter/computeds/trialSessionsHelper';
import {
  SESSION_STATUS_TYPES,
  TrialSessionProceedingType,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';

const filters: TrialSessionsFilters = {
  currentTab: 'calendared' as 'calendared' | 'new',
  endDate: '',
  judges: {},
  pageNumber: 0,
  proceedingType: 'All' as TrialSessionProceedingType,
  sessionStatus: SESSION_STATUS_TYPES.open,
  sessionTypes: {},
  startDate: '',
  trialLocations: {},
};

export const initialTrialSessionPageState = {
  filters,
  specialTrialSessionCopyNotesObject: {},
  trialSessions: [] as ExtendedTrialSessionInfoDTO[],
};

export type TrialSessionsFilters = {
  currentTab: 'calendared' | 'new';
  endDate: string;
  pageNumber: number;
  judges: Record<string, { name: string; userId: string }>;
  proceedingType: TrialSessionProceedingType | 'All';
  sessionStatus: string;
  sessionTypes: Record<string, TrialSessionTypes>;
  startDate: string;
  trialLocations: Record<string, string>;
};
