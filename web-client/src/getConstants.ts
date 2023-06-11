/* istanbul ignore file */

import {
  ADC_SECTION,
  ADMISSIONS_STATUS_OPTIONS,
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_OPINION_TYPES_LIST,
  ADVANCED_SEARCH_TABS,
  ALLOWLIST_FEATURE_FLAGS,
  AMENDMENT_EVENT_CODES,
  AMICUS_BRIEF_EVENT_CODE,
  ASCENDING,
  BENCH_OPINION_EVENT_CODE,
  BRIEF_EVENTCODES,
  BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX,
  CASE_INVENTORY_PAGE_SIZE,
  CASE_LIST_PAGE_SIZE,
  CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT,
  CASE_SEARCH_PAGE_SIZE,
  CASE_SERVICES_SUPERVISOR_SECTION,
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
  CHAMBERS_SECTION,
  CHIEF_JUDGE,
  CLOSED_CASE_STATUSES,
  CONFIGURATION_ITEM_KEYS,
  CONTACT_CHANGE_DOCUMENT_TYPES,
  CONTACT_TYPES,
  CONTACT_TYPE_TITLES,
  COUNTRY_TYPES,
  COURT_ISSUED_DOCUMENT_TYPES,
  COURT_ISSUED_EVENT_CODES,
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  DATE_RANGE_SEARCH_OPTIONS,
  DEADLINE_REPORT_PAGE_SIZE,
  DEFAULT_PROCEDURE_TYPE,
  DESCENDING,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_RECORD_FILTER_OPTIONS,
  DOCKET_SECTION,
  DOCUMENT_EXTERNAL_CATEGORIES,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  DOCUMENT_INTERNAL_CATEGORIES_MAP,
  DOCUMENT_NOTICE_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  DOCUMENT_SERVED_MESSAGES,
  EMPLOYER_OPTIONS,
  ESTATE_TYPES,
  EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
  EVENT_CODES_REQUIRING_SIGNATURE,
  EVENT_CODES_VISIBLE_TO_PUBLIC,
  EXHIBIT_EVENT_CODES,
  EXTERNAL_DOCUMENTS_ARRAY,
  FILING_TYPES,
  GENERIC_ORDER_EVENT_CODE,
  HYBRID_SESSION_TYPES,
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_FILE_MAP,
  INITIAL_DOCUMENT_TYPES_MAP,
  INTERNAL_DOCUMENTS_ARRAY,
  IRS_SYSTEM_SECTION,
  JURISDICTIONAL_OPTIONS,
  LODGED_EVENT_CODE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_PRACTITIONER_DOCUMENT_DESCRIPTION_CHARACTERS,
  MAX_SEARCH_RESULTS,
  MAX_STAMP_CUSTOM_TEXT_CHARACTERS,
  MOTION_DISPOSITIONS,
  MOTION_EVENT_CODES,
  MULTI_DOCKET_FILING_EVENT_CODES,
  NON_MULTI_DOCKETABLE_EVENT_CODES,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES,
  OBJECTIONS_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  OPINION_EVENT_CODES_WITHOUT_BENCH_OPINION,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
  ORDER_TYPES,
  OTHER_TYPES,
  PARTIES_CODES,
  PARTY_TYPES,
  PARTY_VIEW_TABS,
  PAYMENT_STATUS,
  PENALTY_TYPES,
  PETITIONER_CONTACT_TYPES,
  PETITIONS_SECTION,
  POLICY_DATE_IMPACTED_EVENTCODES,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP,
  PRACTITIONER_DOCUMENT_TYPES,
  PRACTITIONER_DOCUMENT_TYPES_MAP,
  PRACTITIONER_TYPE_OPTIONS,
  PROCEDURE_TYPES,
  PROPOSED_STIPULATED_DECISION_EVENT_CODE,
  ROLES,
  SCAN_MODES,
  SCAN_MODE_LABELS,
  SECTIONS,
  SERVICE_INDICATOR_TYPES,
  SESSION_STATUS_GROUPS,
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  SIGNED_DOCUMENT_TYPES,
  SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES,
  STAMPED_DOCUMENTS_ALLOWLIST,
  STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  STIPULATED_DECISION_EVENT_CODE,
  STRICKEN_FROM_TRIAL_SESSION_MESSAGE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_CITIES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
  TRIAL_STATUS_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
  UNSERVABLE_EVENT_CODES,
  US_STATES,
  US_STATES_OTHER,
} from '../../shared/src/business/entities/EntityConstants';
import {
  ENTERED_AND_SERVED_EVENT_CODES,
  SERVICE_STAMP_OPTIONS,
} from '../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { FORMATS } from '../../shared/src/business/utilities/DateHandler';
import { ROLE_PERMISSIONS } from '../../shared/src/authorization/authorizationClientService';
import { SERVICE_INDICATOR_ERROR } from '../../shared/src/business/entities/EntityValidationConstants';

const MINUTES = 60 * 1000;

const EXTERNAL_USER_DASHBOARD_TABS = {
  CLOSED: 'Closed',
  OPEN: 'Open',
};

const CHRONOLOGICALLY_ASCENDING = 'Oldest to newest';
const CHRONOLOGICALLY_DESCENDING = 'Newest to oldest';
const ALPHABETICALLY_ASCENDING = 'In A-Z ascending order';
const ALPHABETICALLY_DESCENDING = 'In Z-A descending order';

const NEGATIVE_VALUE_CONFIRMATION_TEXT =
  'You are entering a negative value, please confirm before saving.';

export const getConstants = () => ({
  ADC_SECTION,
  ADMISSIONS_STATUS_OPTIONS,
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_OPINION_TYPES_LIST,
  ADVANCED_SEARCH_TABS,
  ALLOWLIST_FEATURE_FLAGS,
  ALPHABETICALLY_ASCENDING,
  ALPHABETICALLY_DESCENDING,
  AMENDMENT_EVENT_CODES,
  AMICUS_BRIEF_EVENT_CODE,
  ASCENDING,
  BENCH_OPINION_EVENT_CODE,
  BRIEF_EVENTCODES,
  BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX,
  CASE_INVENTORY_PAGE_SIZE,
  CASE_LIST_PAGE_SIZE,
  CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT,
  CASE_SEARCH_PAGE_SIZE,
  CASE_SERVICES_SUPERVISOR_SECTION,
  CASE_STATUS_TYPES,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CATEGORIES: DOCUMENT_EXTERNAL_CATEGORIES,
  CATEGORY_MAP: DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  CHAMBERS_SECTION,
  CHANNEL_NAME: 'ustc-broadcast',
  CHIEF_JUDGE,
  CHRONOLOGICALLY_ASCENDING,
  CHRONOLOGICALLY_DESCENDING,
  CLOSED_CASE_STATUSES,
  CONFIGURATION_ITEM_KEYS,
  CONTACT_CHANGE_DOCUMENT_TYPES,
  CONTACT_TYPE_TITLES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_DOCUMENT_TYPES,
  COURT_ISSUED_EVENT_CODES,
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  DATE_FORMATS: FORMATS,
  DATE_RANGE_SEARCH_OPTIONS,
  DEADLINE_REPORT_PAGE_SIZE,
  DEFAULT_PROCEDURE_TYPE,
  DESCENDING,
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_RECORD_FILTER_OPTIONS,
  DOCKET_SECTION,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  DOCUMENT_SERVED_MESSAGES,
  EMPLOYER_OPTIONS,
  ENTERED_AND_SERVED_EVENT_CODES,
  ESTATE_TYPES,
  EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
  EVENT_CODES_REQUIRING_SIGNATURE,
  EVENT_CODES_VISIBLE_TO_PUBLIC,
  EXHIBIT_EVENT_CODES,
  EXTERNAL_DOCUMENTS_ARRAY,
  EXTERNAL_USER_DASHBOARD_TABS,
  FILING_TYPES,
  FROM_PAGES: {
    caseDetail: 'case-detail',
    qcMyInProgress: 'qc-my-in-progress',
    qcMyInbox: 'qc-my-inbox',
    qcSectionInProgress: 'qc-section-in-progress',
    qcSectionInbox: 'qc-section-inbox',
  },
  GENERIC_ORDER_EVENT_CODE,
  HYBRID_SESSION_TYPES,
  IDLE_STATUS: { ACTIVE: 'active', IDLE: 'idle' },
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_FILE_MAP,
  INITIAL_DOCUMENT_TYPES_MAP,
  INTERNAL_CATEGORY_MAP: DOCUMENT_INTERNAL_CATEGORIES_MAP,
  INTERNAL_DOCUMENTS_ARRAY,
  IRS_SYSTEM_SECTION,
  JURISDICTIONAL_OPTIONS,
  LODGED_EVENT_CODE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_PRACTITIONER_DOCUMENT_DESCRIPTION_CHARACTERS,
  MAX_SEARCH_RESULTS,
  MAX_STAMP_CUSTOM_TEXT_CHARACTERS,
  MOTION_DISPOSITIONS,
  MOTION_EVENT_CODES,
  MULTI_DOCKET_FILING_EVENT_CODES,
  NEGATIVE_VALUE_CONFIRMATION_TEXT,
  NON_MULTI_DOCKETABLE_EVENT_CODES,
  NOTICE_EVENT_CODES: DOCUMENT_NOTICE_EVENT_CODES,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES,
  OBJECTIONS_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  OPINION_EVENT_CODES_WITHOUT_BENCH_OPINION,
  ORDER_EVENT_CODES,
  ORDER_TYPES_MAP: ORDER_TYPES,
  OTHER_TYPES,
  PARTIES_CODES,
  PARTY_TYPES,
  PARTY_VIEW_TABS,
  PAYMENT_STATUS,
  PENALTY_TYPES,
  PETITIONER_CONTACT_TYPES,
  PETITIONS_SECTION,
  POLICY_DATE_IMPACTED_EVENTCODES,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP,
  PRACTITIONER_DOCUMENT_TYPES,
  PRACTITIONER_DOCUMENT_TYPES_MAP,
  PRACTITIONER_TYPE_OPTIONS,
  PROCEDURE_TYPES,
  PROPOSED_STIPULATED_DECISION_EVENT_CODE,
  REFRESH_INTERVAL: 20 * MINUTES,
  ROLE_PERMISSIONS,
  SCAN_MODE_LABELS,
  SCAN_MODES,
  SECTIONS,
  SERVICE_INDICATOR_ERROR,
  SERVICE_INDICATOR_TYPES,
  SERVICE_STAMP_OPTIONS,
  SESSION_DEBOUNCE: 250,
  SESSION_MODAL_TIMEOUT:
    (process.env.SESSION_MODAL_TIMEOUT &&
      parseInt(process.env.SESSION_MODAL_TIMEOUT)) ||
    5 * MINUTES,
  SESSION_STATUS_GROUPS,
  SESSION_STATUS_TYPES,
  SESSION_TIMEOUT:
    (process.env.SESSION_TIMEOUT && parseInt(process.env.SESSION_TIMEOUT)) ||
    55 * MINUTES,
  SESSION_TYPES,
  SIGNED_DOCUMENT_TYPES,
  SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES,
  STAMPED_DOCUMENTS_ALLOWLIST,
  STATUS_TYPES: CASE_STATUS_TYPES,
  STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  STIPULATED_DECISION_EVENT_CODE,
  STRICKEN_FROM_TRIAL_SESSION_MESSAGE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_CITIES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
  TRIAL_STATUS_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
  UNSERVABLE_EVENT_CODES,
  US_STATES,
  US_STATES_OTHER,
  USER_ROLES: ROLES,
});
