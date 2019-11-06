const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { updateCaseStatusInteractor } = require('./updateCaseStatusInteractor');
const { User } = require('../entities/User');

const MOCK_TRIAL_SESSION = {
  caseOrder: [
    { caseId: MOCK_CASE.caseId },
    { caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6' },
  ],
  isCalendared: true,
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, AL',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

describe('updateCaseStatusInteractor', () => {
  let applicationContext;

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'nope',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: caseToUpdate => Promise.resolve(caseToUpdate),
        };
      },
    };
    let error;
    try {
      await updateCaseStatusInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        caseStatus: Case.STATUS_TYPES.cav,
      });
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
    expect(error.message).toContain('Unauthorized for update case');
  });

  it('should call updateCase with the updated case status and return the updated case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
        };
      },
    };
    const result = await updateCaseStatusInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.cav,
    });
    expect(result.status).toEqual(Case.STATUS_TYPES.cav);
  });

  it('should call updateCase with the updated case status and call removeCaseFromTrial if the old case status was calendared and return the updated case', async () => {
    const getTrialSessionByIdStub = jest.fn(async () => {
      return MOCK_TRIAL_SESSION;
    });
    const updateTrialSessionStub = jest.fn(async updatedTrialSession => {
      return updatedTrialSession;
    });
    const getCaseByCaseIdStub = jest
      .fn()
      .mockReturnValueOnce({
        ...MOCK_CASE,
        status: Case.STATUS_TYPES.calendared,
      })
      .mockReturnValueOnce({
        ...MOCK_CASE,
        status: Case.STATUS_TYPES.cav,
      });

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          createCaseTrialSortMappingRecords: () => {},
          getCaseByCaseId: getCaseByCaseIdStub,
          getTrialSessionById: getTrialSessionByIdStub,
          updateCase: ({ caseToUpdate }) => Promise.resolve(caseToUpdate),
          updateTrialSession: updateTrialSessionStub,
        };
      },
    };
    const result = await updateCaseStatusInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      caseStatus: Case.STATUS_TYPES.cav,
    });
    expect(result.status).toEqual(Case.STATUS_TYPES.cav);
    expect(result.trialSessionId).toBeUndefined();
  });
});
