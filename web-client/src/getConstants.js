import {
  ADC_SECTION,
  ADMISSIONS_STATUS_OPTIONS,
  ADVANCED_SEARCH_TABS,
  BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX,
  CASE_INVENTORY_PAGE_SIZE,
  CASE_LIST_PAGE_SIZE,
  CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT,
  CASE_SEARCH_PAGE_SIZE,
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CHAMBERS_SECTION,
  CHAMBERS_SECTIONS,
  CHAMBERS_SECTIONS_LABELS,
  CHIEF_JUDGE,
  CONTACT_CHANGE_DOCUMENT_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_DOCUMENT_TYPES,
  COURT_ISSUED_EVENT_CODES,
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  DEADLINE_REPORT_PAGE_SIZE,
  DEFAULT_PROCEDURE_TYPE,
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
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_FILE_MAP,
  INITIAL_DOCUMENT_TYPES_MAP,
  INTERNAL_DOCUMENTS_ARRAY,
  IRS_SYSTEM_SECTION,
  JUDGES_CHAMBERS,
  JUDGES_CHAMBERS_WITH_LEGACY,
  LODGED_EVENT_CODE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_SEARCH_RESULTS,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES,
  OBJECTIONS_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  OPINION_EVENT_CODES,
  ORDER_EVENT_CODES,
  ORDER_TYPES,
  OTHER_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PETITIONS_SECTION,
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
  TODAYS_ORDERS_PAGE_SIZE,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_CITIES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_STATUS_TYPES,
  UNSERVABLE_EVENT_CODES,
  US_STATES,
  US_STATES_OTHER,
} from '../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '../../shared/src/business/utilities/DateHandler';
import { ROLE_PERMISSIONS } from '../../shared/src/authorization/authorizationClientService';
import { SERVICE_STAMP_OPTIONS } from '../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';

const MINUTES = 60 * 1000;

const EXTERNAL_USER_DASHBOARD_TABS = {
  CLOSED: 'Closed',
  OPEN: 'Open',
};

export const getConstants = () => ({
  ADC_SECTION,
  ADMISSIONS_STATUS_OPTIONS,
  ADVANCED_SEARCH_TABS,
  BUSINESS_TYPES: BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX,
  CASE_INVENTORY_PAGE_SIZE,
  CASE_LIST_PAGE_SIZE,
  CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT,
  CASE_SEARCH_PAGE_SIZE,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CATEGORIES: DOCUMENT_EXTERNAL_CATEGORIES,
  CATEGORY_MAP: DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  CHAMBERS_SECTION,
  CHAMBERS_SECTIONS,
  CHAMBERS_SECTIONS_LABELS,
  CHANNEL_NAME: 'ustc-broadcast',
  CHIEF_JUDGE,
  CONTACT_CHANGE_DOCUMENT_TYPES: CONTACT_CHANGE_DOCUMENT_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_DOCUMENT_TYPES,
  COURT_ISSUED_EVENT_CODES: COURT_ISSUED_EVENT_CODES,
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  DATE_FORMATS: FORMATS,
  DEADLINE_REPORT_PAGE_SIZE,
  DEFAULT_PROCEDURE_TYPE,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  EMPLOYER_OPTIONS,
  ESTATE_TYPES,
  EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
  EVENT_CODES_REQUIRING_SIGNATURE,
  EVENT_CODES_VISIBLE_TO_PUBLIC,
  EXTERNAL_USER_DASHBOARD_TABS,
  FILING_TYPES,
  IDLE_STATUS: { ACTIVE: 'active', IDLE: 'idle' },
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_FILE_MAP,
  INITIAL_DOCUMENT_TYPES_MAP,
  INTERNAL_CATEGORY_MAP: DOCUMENT_INTERNAL_CATEGORIES_MAP,
  INTERNAL_DOCUMENTS_ARRAY,
  IRS_SYSTEM_SECTION,
  JUDGES_CHAMBERS,
  JUDGES_CHAMBERS_WITH_LEGACY,
  LODGED_EVENT_CODE,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_SEARCH_RESULTS,
  NOTICE_EVENT_CODES: DOCUMENT_NOTICE_EVENT_CODES,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES,
  OBJECTIONS_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  OPINION_EVENT_CODES,
  ORDER_EVENT_CODES,
  ORDER_TYPES_MAP: ORDER_TYPES,
  OTHER_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PETITIONS_SECTION,
  PRACTITIONER_TYPE_OPTIONS,
  PROCEDURE_TYPES,
  PROPOSED_STIPULATED_DECISION_EVENT_CODE,
  REFRESH_INTERVAL: 20 * MINUTES,
  ROLE_PERMISSIONS,
  SCAN_MODE_LABELS,
  SCAN_MODES,
  SECTIONS,
  SERVED_PARTIES_CODES,
  SERVICE_INDICATOR_TYPES,
  SERVICE_STAMP_OPTIONS,
  SESSION_DEBOUNCE: 250,
  SESSION_MODAL_TIMEOUT: 5 * MINUTES,
  SESSION_STATUS_GROUPS,
  SESSION_TIMEOUT:
    (process.env.SESSION_TIMEOUT && parseInt(process.env.SESSION_TIMEOUT)) ||
    55 * MINUTES,
  SIGNED_DOCUMENT_TYPES: SIGNED_DOCUMENT_TYPES,
  STATUS_TYPES: CASE_STATUS_TYPES,
  STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE: STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  STIPULATED_DECISION_EVENT_CODE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TODAYS_ORDERS_PAGE_SIZE,
  TRANSCRIPT_EVENT_CODE: TRANSCRIPT_EVENT_CODE,
  TRIAL_CITIES: TRIAL_CITIES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_TYPES: SESSION_TYPES,
  TRIAL_STATUS_TYPES,
  UNSERVABLE_EVENT_CODES,
  US_STATES,
  US_STATES_OTHER,
  USER_ROLES: ROLES,
});
