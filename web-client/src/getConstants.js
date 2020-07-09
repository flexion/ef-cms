import {
  ADC_SECTION,
  ADMISSIONS_STATUS_OPTIONS,
  BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX,
  CASE_SEARCH_PAGE_SIZE,
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CHAMBERS_SECTION,
  CHAMBERS_SECTIONS,
  CHIEF_JUDGE,
  CONTACT_CHANGE_DOCUMENT_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_EVENT_CODES,
  DEFAULT_PROCEDURE_TYPE,
  DOCUMENT_EXTERNAL_CATEGORIES,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  DOCUMENT_INTERNAL_CATEGORIES_MAP,
  DOCUMENT_NOTICE_EVENT_CODES,
  EMPLOYER_OPTIONS,
  ESTATE_TYPES,
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  ORDER_TYPES,
  OTHER_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PRACTITIONER_TYPE_OPTIONS,
  PROCEDURE_TYPES,
  ROLES,
  SCAN_MODES,
  SECTIONS,
  SERVICE_INDICATOR_TYPES,
  SESSION_STATUS_GROUPS,
  SESSION_TYPES,
  SIGNED_DOCUMENT_TYPES,
  STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_CITIES,
  TRIAL_STATUS_TYPES,
  US_STATES,
  US_STATES_OTHER,
} from '../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '../../shared/src/business/utilities/DateHandler';
import { ROLE_PERMISSIONS } from '../../shared/src/authorization/authorizationClientService';
import { SERVICE_STAMP_OPTIONS } from '../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';

const MINUTES = 60 * 1000;

const ADVANCED_SEARCH_TABS = {
  CASE: 'case',
  OPINION: 'opinion',
  ORDER: 'order',
  PRACTITIONER: 'practitioner',
};

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
  CASE_INVENTORY_PAGE_SIZE: 2,
  CASE_LIST_PAGE_SIZE: 20,
  CASE_SEARCH_PAGE_SIZE,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CATEGORIES: DOCUMENT_EXTERNAL_CATEGORIES,
  CATEGORY_MAP: DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  CHAMBERS_SECTION,
  CHAMBERS_SECTIONS,
  CHIEF_JUDGE,
  CONTACT_CHANGE_DOCUMENT_TYPES: CONTACT_CHANGE_DOCUMENT_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_EVENT_CODES: COURT_ISSUED_EVENT_CODES,
  DATE_FORMATS: FORMATS,
  DEFAULT_PROCEDURE_TYPE,
  EMPLOYER_OPTIONS,
  ESTATE_TYPES,
  EXTERNAL_USER_DASHBOARD_TABS,
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  INTERNAL_CATEGORY_MAP: DOCUMENT_INTERNAL_CATEGORIES_MAP,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  NOTICE_EVENT_CODES: DOCUMENT_NOTICE_EVENT_CODES,
  ORDER_TYPES_MAP: ORDER_TYPES,
  OTHER_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PRACTITIONER_TYPE_OPTIONS,
  PROCEDURE_TYPES,
  REFRESH_INTERVAL: 20 * MINUTES,
  ROLE_PERMISSIONS,
  SCAN_MODES,
  SECTIONS,
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
  SYSTEM_GENERATED_DOCUMENT_TYPES: SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRANSCRIPT_EVENT_CODE: TRANSCRIPT_EVENT_CODE,
  TRIAL_CITIES: TRIAL_CITIES,
  TRIAL_SESSION_TYPES: SESSION_TYPES,
  TRIAL_STATUS_TYPES,
  US_STATES,
  US_STATES_OTHER,
  USER_ROLES: ROLES,
});
