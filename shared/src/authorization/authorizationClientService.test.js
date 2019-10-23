const {
  GET_CASE,
  GET_CASES_BY_STATUS,
  isAuthorized,
  PETITION,
  START_PAPER_CASE,
  UPDATE_CASE,
  WORKITEM,
} = require('./authorizationClientService');
const { User } = require('../business/entities/User');

describe('Authorization client service', () => {
  it('returns true for any user whose userId matches the 3rd owner argument, in this case "someUser" === "someUser"', () => {
    expect(
      isAuthorized(
        { role: User.ROLES.petitioner, userId: 'someUser' },
        'unknown action',
        'someUser',
      ),
    ).toBeTruthy();
  });

  it('should authorize a petitionsclerk for getCase', () => {
    expect(
      isAuthorized(
        { role: User.ROLES.petitionsClerk, userId: 'petitionsclerk' },
        GET_CASE,
      ),
    ).toBeTruthy();
  });

  it('should return false when a user doesnt have a petitionsclerk role', () => {
    expect(
      isAuthorized(
        { role: User.ROLES.petitioner, userId: 'someUser' },
        GET_CASES_BY_STATUS,
      ),
    ).toBeFalsy();
  });

  it('should authorize a petitions clerk for workitems', () => {
    expect(
      isAuthorized(
        { role: User.ROLES.petitionsClerk, userId: 'petitionsclerk' },
        WORKITEM,
      ),
    ).toBeTruthy();
  });

  it('should authorize a petitions clerk for start a case from paper', () => {
    expect(
      isAuthorized(
        { role: User.ROLES.petitionsClerk, userId: 'petitionsclerk' },
        START_PAPER_CASE,
      ),
    ).toBeTruthy();
  });

  it('should authorize a docket clerk for workitems', () => {
    expect(
      isAuthorized(
        { role: User.ROLES.docketClerk, userId: 'docketclerk' },
        WORKITEM,
      ),
    ).toBeTruthy();
  });

  it('should authorize an adc user for workitems', () => {
    expect(
      isAuthorized({ role: User.ROLES.adc, userId: 'adc' }, WORKITEM),
    ).toBeTruthy();
  });

  it('should authorize a respondent for getCase', () => {
    expect(
      isAuthorized(
        { role: User.ROLES.respondent, userId: 'respondent' },
        UPDATE_CASE,
      ),
    ).toBeTruthy();
  });

  it('should authorize a docketclerk for updatecase', () => {
    expect(
      isAuthorized(
        { role: User.ROLES.docketClerk, userId: 'docketclerk' },
        UPDATE_CASE,
      ),
    ).toBeTruthy();
  });

  it('should evaluate owner when the owner param is provided', () => {
    expect(
      isAuthorized(
        { role: User.ROLES.docketClerk, userId: '123456' },
        UPDATE_CASE,
        123456,
      ),
    ).toBeTruthy();
  });
});
