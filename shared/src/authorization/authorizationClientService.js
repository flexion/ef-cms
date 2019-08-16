exports.CASE_METADATA = 'caseMetadata';
exports.FILE_EXTERNAL_DOCUMENT = 'fileExternalDocument';
exports.GET_CASE = 'getCase';
exports.PETITION = 'getPetitionOptions';
exports.UPDATE_CASE = 'updateCase';
exports.WORKITEM = 'workItem';
exports.CREATE_USER = 'createUser';
exports.GET_USERS_IN_SECTIION = 'getUsersInSection';
exports.START_PAPER_CASE = 'startPaperCase';
exports.GET_READ_MESSAGES = 'getReadMessages';
exports.TRIAL_SESSIONS = 'trialSessions';
exports.TRIAL_SESSION_WORKING_COPY = 'trialSessionWorkingCopy';
exports.CREATE_COURT_ISSUED_ORDER = 'createCourtIssuedOrder';
exports.CASE_DEADLINE = 'CASE_DEADLINE';
exports.SERVE_DOCUMENT = 'SERVE_DOCUMENT';
exports.ASSOCIATE_USER_WITH_CASE = 'ASSOCIATE_USER_WITH_CASE';

const AUTHORIZATION_MAP = {
  admin: [exports.CREATE_USER],
  docketclerk: [
    exports.ASSOCIATE_USER_WITH_CASE,
    exports.CASE_DEADLINE,
    exports.CASE_METADATA,
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_READ_MESSAGES,
    exports.GET_USERS_IN_SECTION,
    exports.SERVE_DOCUMENT,
    exports.START_PAPER_CASE,
    exports.TRIAL_SESSIONS,
    exports.UPDATE_CASE,
    exports.WORKITEM,
  ],
  judge: [
    // TODO: review this list for accuracy!
    exports.ASSOCIATE_USER_WITH_CASE,
    exports.CASE_DEADLINE,
    exports.CASE_METADATA,
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_READ_MESSAGES,
    exports.GET_USERS_IN_SECTION,
    exports.PETITION,
    exports.SERVE_DOCUMENT,
    exports.START_PAPER_CASE,
    exports.TRIAL_SESSION_WORKING_COPY,
    exports.TRIAL_SESSIONS,
    exports.UPDATE_CASE,
    exports.WORKITEM,
  ],
  petitioner: [exports.FILE_EXTERNAL_DOCUMENT, exports.PETITION],
  petitionsclerk: [
    exports.ASSOCIATE_USER_WITH_CASE,
    exports.CASE_DEADLINE,
    exports.CASE_METADATA,
    exports.CREATE_COURT_ISSUED_ORDER,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_READ_MESSAGES,
    exports.GET_USERS_IN_SECTION,
    exports.PETITION,
    exports.START_PAPER_CASE,
    exports.TRIAL_SESSIONS,
    exports.UPDATE_CASE,
    exports.WORKITEM,
  ],

  practitioner: [
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.GET_CASE,
    exports.PETITION,
  ],
  respondent: [
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.GET_CASE,
    exports.UPDATE_CASE,
  ],
  seniorattorney: [
    exports.ASSOCIATE_USER_WITH_CASE,
    exports.CASE_METADATA,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_READ_MESSAGES,
    exports.GET_USERS_IN_SECTION,
    exports.TRIAL_SESSIONS,
    exports.UPDATE_CASE,
    exports.WORKITEM,
  ],
  taxpayer: [exports.PETITION],
};

/**
 * Checks user permissions for an action
 *
 * @param {object} user the user to check for authorization
 * @param {string} action the action to verify if the user is authorized for
 * @param {string} owner the user id of the owner of the item to verify
 * @returns {boolean} true if user is authorized, false otherwise
 */
exports.isAuthorized = (user, action, owner) => {
  if (user.userId && user.userId === owner) {
    return true;
  }

  const userRole = user.role;
  if (!AUTHORIZATION_MAP[userRole]) {
    return false;
  }

  const actionInRoleAuthorization = AUTHORIZATION_MAP[userRole].includes(
    action,
  );
  return actionInRoleAuthorization;
};
