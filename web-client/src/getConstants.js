/* istanbul ignore file */

import {
  ADC_SECTION,
  ADMISSIONS_STATUS_OPTIONS,
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_OPINION_TYPES_LIST,
  ADVANCED_SEARCH_TABS,
  ALLOWLIST_FEATURE_FLAGS,
  BENCH_OPINION_EVENT_CODE,
  BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX,
  CASE_INVENTORY_PAGE_SIZE,
  CASE_LIST_PAGE_SIZE,
  CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT,
  CASE_SEARCH_PAGE_SIZE,
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
  CHAMBERS_SECTION,
  CHIEF_JUDGE,
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
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  DOCUMENT_EXTERNAL_CATEGORIES,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  DOCUMENT_INTERNAL_CATEGORIES_MAP,
  DOCUMENT_NOTICE_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  EMPLOYER_OPTIONS,
  ESTATE_TYPES,
  EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
  EVENT_CODES_REQUIRING_SIGNATURE,
  EVENT_CODES_VISIBLE_TO_PUBLIC,
  EXTERNAL_DOCUMENTS_ARRAY,
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_FILE_MAP,
  INITIAL_DOCUMENT_TYPES_MAP,
  INTERNAL_DOCUMENTS_ARRAY,
  IRS_SYSTEM_SECTION,
  LODGED_EVENT_CODE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_SEARCH_RESULTS,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES,
  OBJECTIONS_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  OPINION_EVENT_CODES_WITHOUT_BENCH_OPINION,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
  ORDER_TYPES,
  OTHER_TYPES,
  PARTY_TYPES,
  PARTY_VIEW_TABS,
  PAYMENT_STATUS,
  PETITIONER_CONTACT_TYPES,
  PETITIONS_SECTION,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP,
  PRACTITIONER_TYPE_OPTIONS,
  PROCEDURE_TYPES,
  PROPOSED_STIPULATED_DECISION_EVENT_CODE,
  ROLES,
  SCAN_MODES,
  SCAN_MODE_LABELS,
  SECTIONS,
  SERVED_PARTIES_CODES,
  SERVICE_INDICATOR_TYPES,
  SESSION_STATUS_GROUPS,
  SESSION_TYPES,
  SIGNED_DOCUMENT_TYPES,
  STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  STIPULATED_DECISION_EVENT_CODE,
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
import { FORMATS } from '../../shared/src/business/utilities/DateHandler';
import { ROLE_PERMISSIONS } from '../../shared/src/authorization/authorizationClientService';
import { SERVICE_INDICATOR_ERROR } from '../../shared/src/business/entities/EntityValidationConstants';
import { SERVICE_STAMP_OPTIONS } from '../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';

const MINUTES = 60 * 1000;

const EXTERNAL_USER_DASHBOARD_TABS = {
  CLOSED: 'Closed',
  OPEN: 'Open',
};

export const getConstants = () => ({
  ADC_SECTION,
  ADMISSIONS_STATUS_OPTIONS,
  ADVANCED_SEARCH_OPINION_TYPES,
  ADVANCED_SEARCH_OPINION_TYPES_LIST,
  ADVANCED_SEARCH_TABS,
  ALLOWLIST_FEATURE_FLAGS,
  BENCH_OPINION_EVENT_CODE,
  BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX,
  CASE_INVENTORY_PAGE_SIZE,
  CASE_LIST_PAGE_SIZE,
  CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT,
  CASE_SEARCH_PAGE_SIZE,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CATEGORIES: DOCUMENT_EXTERNAL_CATEGORIES,
  CATEGORY_MAP: DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  CHAMBERS_SECTION,
  CHANNEL_NAME: 'ustc-broadcast',
  CHIEF_JUDGE,
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
  DOCKET_ENTRY_SEALED_TO_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  EMPLOYER_OPTIONS,
  ESTATE_TYPES,
  EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
  EVENT_CODES_REQUIRING_SIGNATURE,
  EVENT_CODES_VISIBLE_TO_PUBLIC,
  EXTERNAL_DOCUMENTS_ARRAY,
  EXTERNAL_USER_DASHBOARD_TABS,
  FILING_TYPES,
  IDLE_STATUS: { ACTIVE: 'active', IDLE: 'idle' },
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_FILE_MAP,
  INITIAL_DOCUMENT_TYPES_MAP,
  INTERNAL_CATEGORY_MAP: DOCUMENT_INTERNAL_CATEGORIES_MAP,
  INTERNAL_DOCUMENTS_ARRAY,
  IRS_SYSTEM_SECTION,
  LODGED_EVENT_CODE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_SEARCH_RESULTS,
  NOTICE_EVENT_CODES: DOCUMENT_NOTICE_EVENT_CODES,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES,
  OBJECTIONS_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  OPINION_EVENT_CODES_WITHOUT_BENCH_OPINION,
  ORDER_EVENT_CODES,
  ORDER_TYPES_MAP: ORDER_TYPES,
  OTHER_TYPES,
  PARTY_TYPES,
  PARTY_VIEW_TABS,
  PAYMENT_STATUS,
  PETITIONER_CONTACT_TYPES,
  PETITIONS_SECTION,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP,
  PRACTITIONER_TYPE_OPTIONS,
  PROCEDURE_TYPES,
  PROPOSED_STIPULATED_DECISION_EVENT_CODE,
  REFRESH_INTERVAL: 20 * MINUTES,
  ROLE_PERMISSIONS,
  SCAN_MODE_LABELS,
  SCAN_MODES,
  SECTIONS,
  SERVED_PARTIES_CODES,
  SERVICE_INDICATOR_ERROR,
  SERVICE_INDICATOR_TYPES,
  SERVICE_STAMP_OPTIONS,
  SESSION_DEBOUNCE: 250,
  SESSION_MODAL_TIMEOUT:
    (process.env.SESSION_MODAL_TIMEOUT &&
      parseInt(process.env.SESSION_MODAL_TIMEOUT)) ||
    5 * MINUTES,
  SESSION_STATUS_GROUPS,
  SESSION_TIMEOUT:
    (process.env.SESSION_TIMEOUT && parseInt(process.env.SESSION_TIMEOUT)) ||
    55 * MINUTES,
  SIGNED_DOCUMENT_TYPES,
  STATUS_TYPES: CASE_STATUS_TYPES,
  STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  STIPULATED_DECISION_EVENT_CODE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_CITIES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
  TRIAL_SESSION_TYPES: SESSION_TYPES,
  TRIAL_STATUS_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
  UNSERVABLE_EVENT_CODES,
  US_STATES,
  US_STATES_OTHER,
  USER_ROLES: ROLES,
});
