const ROLE_PERMISSIONS = {
  ADD_CASE_TO_TRIAL_SESSION: 'ADD_CASE_TO_TRIAL_SESSION',
  ADD_EDIT_JUDGE_USER: 'ADD_EDIT_JUDGE_USER',
  ADD_EDIT_PRACTITIONER_USER: 'ADD_EDIT_PRACTITIONER_USER',
  ADD_EDIT_STATISTICS: 'ADD_EDIT_STATISTICS',
  ADD_PETITIONER_TO_CASE: 'ADD_PETITIONER_TO_CASE',
  ADD_USER_TO_CASE: 'ADD_USER_TO_CASE',
  ADVANCED_SEARCH: 'ADVANCED_SEARCH',
  ARCHIVE_DOCUMENT: 'ARCHIVE_DOCUMENT',
  ASSIGN_WORK_ITEM: 'ASSIGN_WORK_ITEM',
  ASSOCIATE_SELF_WITH_CASE: 'ASSOCIATE_SELF_WITH_CASE',
  ASSOCIATE_USER_WITH_CASE: 'ASSOCIATE_USER_WITH_CASE',
  BATCH_DOWNLOAD_TRIAL_SESSION: 'BATCH_DOWNLOAD_TRIAL_SESSION',
  BLOCK_CASE: 'BLOCK_CASE',
  CASE_CORRESPONDENCE: 'CASE_CORRESPONDENCE',
  CASE_DEADLINE: 'CASE_DEADLINE',
  CASE_INVENTORY_REPORT: 'CASE_INVENTORY_REPORT',
  CASE_NOTES: 'CASE_NOTES',
  CONSOLIDATE_CASES: 'CONSOLIDATE_CASES',
  COURT_ISSUED_DOCUMENT: 'COURT_ISSUED_DOCUMENT',
  CREATE_ORDER_DOCKET_ENTRY: 'CREATE_ORDER_DOCKET_ENTRY',
  CREATE_USER: 'CREATE_USER',
  DOCKET_ENTRY: 'DOCKET_ENTRY',
  EDIT_CASE_DETAILS: 'EDIT_CASE_DETAILS',
  EDIT_COUNSEL_ON_CASE: 'EDIT_COUNSEL_ON_CASE',
  EDIT_DOCKET_ENTRY: 'EDIT_DOCKET_ENTRY',
  EDIT_ORDER: 'EDIT_ORDER',
  EDIT_PETITIONER_EMAIL: 'EDIT_PETITIONER_EMAIL',
  EDIT_PETITIONER_INFO: 'EDIT_PETITIONER_INFO',
  EMAIL_MANAGEMENT: 'EMAIL_MANAGEMENT',
  FILE_EXTERNAL_DOCUMENT: 'FILE_EXTERNAL_DOCUMENT',
  FILE_IN_CONSOLIDATED: 'FILE_IN_CONSOLIDATED',
  GET_CASE: 'GET_CASE',
  GET_JUDGES: 'GET_JUDGES',
  GET_READ_MESSAGES: 'GET_READ_MESSAGES',
  GET_USER_PENDING_EMAIL: 'GET_USER_PENDING_EMAIL',
  GET_USER_PENDING_EMAIL_STATUS: 'GET_USER_PENDING_EMAIL_STATUS',
  GET_USERS_IN_SECTION: 'GET_USERS_IN_SECTION',
  JUDGES_NOTES: 'JUDGES_NOTES',
  MANAGE_PRACTITIONER_USERS: 'MANAGE_PRACTITIONER_USERS',
  PENDING_ITEMS: 'PENDING_ITEMS',
  PETITION: 'PETITION',
  PRIORITIZE_CASE: 'PRIORITIZE_CASE',
  QC_PETITION: 'QC_PETITION',
  REMOVE_PETITIONER: 'REMOVE_PETITIONER',
  SEAL_ADDRESS: 'SEAL_ADDRESS',
  SEAL_CASE: 'SEAL_CASE',
  SEAL_DOCKET_ENTRY: 'SEAL_DOCKET_ENTRY',
  SEND_RECEIVE_MESSAGES: 'SEND_RECEIVE_MESSAGES',
  SERVE_DOCUMENT: 'SERVE_DOCUMENT',
  SERVE_PETITION: 'SERVE_PETITION',
  SERVICE_SUMMARY_REPORT: 'SERVICE_SUMMARY_REPORT',
  SET_FOR_HEARING: 'SET_FOR_HEARING',
  SET_TRIAL_SESSION_CALENDAR: 'SET_TRIAL_SESSION_CALENDAR',
  STAMP_MOTION: 'STAMP_MOTION',
  START_PAPER_CASE: 'START_PAPER_CASE',
  TRACKED_ITEMS: 'TRACKED_ITEMS',
  TRIAL_SESSION_QC_COMPLETE: 'TRIAL_SESSION_QC_COMPLETE',
  TRIAL_SESSION_WORKING_COPY: 'TRIAL_SESSION_WORKING_COPY',
  TRIAL_SESSIONS: 'TRIAL_SESSIONS',
  UNSEAL_CASE: 'UNSEAL_CASE',
  UPDATE_CASE: 'UPDATE_CASE',
  UPDATE_CASE_CONTEXT: 'UPDATE_CASE_CONTEXT',
  UPDATE_CONTACT_INFO: 'UPDATE_CONTACT_INFO',
  UPLOAD_DOCUMENT: 'UPLOAD_DOCUMENT',
  VIEW_DOCUMENTS: 'VIEW_DOCUMENTS',
  VIEW_MESSAGES: 'VIEW_MESSAGES',
  VIEW_PRACTITIONER_CASE_LIST: 'VIEW_PRACTITIONER_CASE_LIST',
  VIEW_SEALED_ADDRESS: 'VIEW_SEALED_ADDRESS',
  VIEW_SEALED_CASE: 'VIEW_SEALED_CASE',
  WORKITEM: 'WORKITEM',
};

exports.ROLE_PERMISSIONS = ROLE_PERMISSIONS;

const allInternalUserPermissions = [
  ROLE_PERMISSIONS.ADD_CASE_TO_TRIAL_SESSION,
  ROLE_PERMISSIONS.ADVANCED_SEARCH,
  ROLE_PERMISSIONS.ARCHIVE_DOCUMENT,
  ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE,
  ROLE_PERMISSIONS.VIEW_PRACTITIONER_CASE_LIST,
  ROLE_PERMISSIONS.BLOCK_CASE,
  ROLE_PERMISSIONS.CASE_DEADLINE,
  ROLE_PERMISSIONS.CASE_INVENTORY_REPORT,
  ROLE_PERMISSIONS.CASE_NOTES,
  ROLE_PERMISSIONS.CONSOLIDATE_CASES,
  ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT,
  ROLE_PERMISSIONS.EDIT_ORDER,
  ROLE_PERMISSIONS.GET_CASE,
  ROLE_PERMISSIONS.GET_JUDGES,
  ROLE_PERMISSIONS.GET_READ_MESSAGES,
  ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL,
  ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL_STATUS,
  ROLE_PERMISSIONS.GET_USERS_IN_SECTION,
  ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS,
  ROLE_PERMISSIONS.PENDING_ITEMS,
  ROLE_PERMISSIONS.PRIORITIZE_CASE,
  ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES,
  ROLE_PERMISSIONS.TRIAL_SESSIONS,
  ROLE_PERMISSIONS.UPDATE_CASE,
  ROLE_PERMISSIONS.UPLOAD_DOCUMENT,
  ROLE_PERMISSIONS.VIEW_DOCUMENTS,
  ROLE_PERMISSIONS.VIEW_MESSAGES,
  ROLE_PERMISSIONS.VIEW_SEALED_CASE,
  ROLE_PERMISSIONS.WORKITEM,
];

const docketClerkPermissions = [
  ...allInternalUserPermissions,
  ROLE_PERMISSIONS.ADD_EDIT_STATISTICS,
  ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE,
  ROLE_PERMISSIONS.ASSIGN_WORK_ITEM,
  ROLE_PERMISSIONS.CASE_CORRESPONDENCE,
  ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY,
  ROLE_PERMISSIONS.DOCKET_ENTRY,
  ROLE_PERMISSIONS.EDIT_CASE_DETAILS,
  ROLE_PERMISSIONS.EDIT_COUNSEL_ON_CASE,
  ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY,
  ROLE_PERMISSIONS.EDIT_PETITIONER_INFO,
  ROLE_PERMISSIONS.REMOVE_PETITIONER,
  ROLE_PERMISSIONS.SEAL_ADDRESS,
  ROLE_PERMISSIONS.SEAL_CASE,
  ROLE_PERMISSIONS.SEAL_DOCKET_ENTRY,
  ROLE_PERMISSIONS.SERVE_DOCUMENT,
  ROLE_PERMISSIONS.SET_FOR_HEARING,
  ROLE_PERMISSIONS.TRACKED_ITEMS,
  ROLE_PERMISSIONS.UNSEAL_CASE,
  ROLE_PERMISSIONS.UPDATE_CASE_CONTEXT,
  ROLE_PERMISSIONS.VIEW_SEALED_ADDRESS,
];

const petitionsClerkPermissions = [
  ...allInternalUserPermissions,
  ROLE_PERMISSIONS.ADD_EDIT_STATISTICS,
  ROLE_PERMISSIONS.ASSIGN_WORK_ITEM,
  ROLE_PERMISSIONS.CASE_CORRESPONDENCE,
  ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY,
  ROLE_PERMISSIONS.EDIT_CASE_DETAILS,
  ROLE_PERMISSIONS.EDIT_COUNSEL_ON_CASE,
  ROLE_PERMISSIONS.QC_PETITION,
  ROLE_PERMISSIONS.SERVE_DOCUMENT,
  ROLE_PERMISSIONS.SERVE_PETITION,
  ROLE_PERMISSIONS.SET_TRIAL_SESSION_CALENDAR,
  ROLE_PERMISSIONS.START_PAPER_CASE,
  ROLE_PERMISSIONS.TRACKED_ITEMS,
  ROLE_PERMISSIONS.TRIAL_SESSION_QC_COMPLETE,
];

const AUTHORIZATION_MAP = {
  adc: [...allInternalUserPermissions, ROLE_PERMISSIONS.STAMP_MOTION],
  admin: [
    ROLE_PERMISSIONS.ADD_EDIT_JUDGE_USER,
    ROLE_PERMISSIONS.ADD_EDIT_PRACTITIONER_USER,
    ROLE_PERMISSIONS.CREATE_USER,
    ROLE_PERMISSIONS.FILE_IN_CONSOLIDATED,
    ROLE_PERMISSIONS.MANAGE_PRACTITIONER_USERS,
  ],
  admissionsclerk: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.ADD_EDIT_PRACTITIONER_USER,
    ROLE_PERMISSIONS.ADD_USER_TO_CASE,
    ROLE_PERMISSIONS.CASE_CORRESPONDENCE,
    ROLE_PERMISSIONS.EDIT_COUNSEL_ON_CASE,
    ROLE_PERMISSIONS.EDIT_PETITIONER_EMAIL,
    ROLE_PERMISSIONS.EDIT_PETITIONER_INFO,
    ROLE_PERMISSIONS.EMAIL_MANAGEMENT,
    ROLE_PERMISSIONS.VIEW_SEALED_ADDRESS,
  ],
  chambers: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.BATCH_DOWNLOAD_TRIAL_SESSION,
    ROLE_PERMISSIONS.JUDGES_NOTES,
    ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY,
    ROLE_PERMISSIONS.STAMP_MOTION,
  ],
  clerkofcourt: [...docketClerkPermissions, ...petitionsClerkPermissions],
  docketclerk: docketClerkPermissions,
  floater: allInternalUserPermissions,
  general: allInternalUserPermissions
    .filter(p => p !== ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES)
    .concat(ROLE_PERMISSIONS.CASE_CORRESPONDENCE),
  inactivePractitioner: [],
  irsPractitioner: [
    ROLE_PERMISSIONS.ADVANCED_SEARCH,
    ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE,
    ROLE_PERMISSIONS.EMAIL_MANAGEMENT,
    ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT,
    ROLE_PERMISSIONS.GET_CASE,
    ROLE_PERMISSIONS.GET_JUDGES,
    ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL_STATUS,
    ROLE_PERMISSIONS.UPDATE_CONTACT_INFO,
    ROLE_PERMISSIONS.UPLOAD_DOCUMENT,
    ROLE_PERMISSIONS.VIEW_DOCUMENTS,
  ],
  irsSuperuser: [
    ROLE_PERMISSIONS.ADVANCED_SEARCH,
    ROLE_PERMISSIONS.GET_CASE,
    ROLE_PERMISSIONS.GET_JUDGES,
    ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL_STATUS,
    ROLE_PERMISSIONS.SERVICE_SUMMARY_REPORT,
    ROLE_PERMISSIONS.VIEW_DOCUMENTS,
    ROLE_PERMISSIONS.VIEW_SEALED_CASE,
  ],
  judge: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.BATCH_DOWNLOAD_TRIAL_SESSION,
    ROLE_PERMISSIONS.JUDGES_NOTES,
    ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY,
    ROLE_PERMISSIONS.STAMP_MOTION,
  ],
  legacyJudge: [],
  petitioner: [
    ROLE_PERMISSIONS.EMAIL_MANAGEMENT,
    ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT,
    ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL_STATUS,
    ROLE_PERMISSIONS.PETITION,
    ROLE_PERMISSIONS.UPDATE_CONTACT_INFO,
    ROLE_PERMISSIONS.UPLOAD_DOCUMENT,
    ROLE_PERMISSIONS.VIEW_DOCUMENTS,
  ],
  petitionsclerk: petitionsClerkPermissions,
  privatePractitioner: [
    ROLE_PERMISSIONS.GET_USER_PENDING_EMAIL_STATUS,
    ROLE_PERMISSIONS.ADVANCED_SEARCH,
    ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE,
    ROLE_PERMISSIONS.EMAIL_MANAGEMENT,
    ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT,
    ROLE_PERMISSIONS.GET_CASE,
    ROLE_PERMISSIONS.GET_JUDGES,
    ROLE_PERMISSIONS.PETITION,
    ROLE_PERMISSIONS.UPDATE_CONTACT_INFO,
    ROLE_PERMISSIONS.UPLOAD_DOCUMENT,
    ROLE_PERMISSIONS.VIEW_DOCUMENTS,
  ],
  reportersOffice: allInternalUserPermissions,
  trialclerk: [
    ...allInternalUserPermissions,
    ROLE_PERMISSIONS.BATCH_DOWNLOAD_TRIAL_SESSION,
    ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY,
  ],
};

exports.AUTHORIZATION_MAP = AUTHORIZATION_MAP;

/**
 * Checks user permissions for an action
 *
 * @param {object} user the user to check for authorization
 * @param {string} action the action to verify if the user is authorized for
 * @param {string} owner the user id of the owner of the item to verify
 * @returns {boolean} true if user is authorized, false otherwise
 */
exports.isAuthorized = (user, action, owner) => {
  if (!user) {
    return false;
  }

  if (user.userId && user.userId === owner) {
    return true;
  }

  const userRole = user.role;
  if (!AUTHORIZATION_MAP[userRole]) {
    return false;
  }

  const roleActionIndex = AUTHORIZATION_MAP[userRole].indexOf(action);

  const actionInRoleAuthorization =
    !!AUTHORIZATION_MAP[userRole][roleActionIndex];

  return actionInRoleAuthorization;
};
