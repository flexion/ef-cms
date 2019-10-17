const sinon = require('sinon');
const {
  removeCaseFromTrialInteractor,
} = require('./removeCaseFromTrialInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { Case } = require('../../entities/cases/Case');

const MOCK_TRIAL_SESSION = {
  caseOrder: [
    { caseId: MOCK_CASE.caseId },
    { caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6' },
  ],
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '3000-03-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '3000',
  trialLocation: 'Birmingham, AL',
  trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
};

describe('remove case from trial session', () => {
  let applicationContext;
  const getTrialSessionByIdStub = sinon.stub().returns(MOCK_TRIAL_SESSION);
  const updateTrialSessionStub = sinon.stub().returns();
  const getCaseByIdStub = sinon.stub().returns({
    ...MOCK_CASE,
    trialLocation: 'Boise, Idaho',
    trialJudge: 'someone',
    trialSessionId: 'abcd',
  });
  const updateCaseStub = sinon.stub().returns();

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitioner',
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseById: getCaseByIdStub,
          getTrialSessionById: getTrialSessionByIdStub,
          updateCase: updateCaseStub,
          updateTrialSession: updateTrialSessionStub,
        };
      },
    };
    await expect(
      removeCaseFromTrialInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
        disposition: 'because',
        trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
      }),
    ).rejects.toThrow();
  });

  it('calls getTrialSessionById, updateTrialSession, getCaseById, and updateCase persistence methods with correct parameters', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseById: getCaseByIdStub,
          getTrialSessionById: getTrialSessionByIdStub,
          updateCase: updateCaseStub,
          updateTrialSession: updateTrialSessionStub,
        };
      },
    };

    await removeCaseFromTrialInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      disposition: 'because',
      trialSessionId: MOCK_TRIAL_SESSION.trialSessionId,
    });

    expect(getTrialSessionByIdStub.called).toEqual(true);
    expect(getTrialSessionByIdStub.getCall(0).args[0].trialSessionId).toEqual(
      MOCK_TRIAL_SESSION.trialSessionId,
    );
    expect(updateTrialSessionStub.called).toEqual(true);
    expect(
      updateTrialSessionStub.getCall(0).args[0].trialSessionToUpdate,
    ).toMatchObject({
      ...MOCK_TRIAL_SESSION,
      caseOrder: [
        {
          caseId: MOCK_CASE.caseId,
          disposition: 'because',
          removedFromTrial: true,
        },
        { caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6' },
      ],
    });
    expect(getCaseByIdStub.called).toEqual(true);
    expect(getCaseByIdStub.getCall(0).args[0].caseId).toEqual(MOCK_CASE.caseId);
    expect(updateCaseStub.called).toEqual(true);
    expect(updateCaseStub.getCall(0).args[0].caseToUpdate).toMatchObject({
      caseId: MOCK_CASE.caseId,
      status: Case.STATUS_TYPES.generalDocketReadyForTrial,
      trialJudge: undefined,
      trialLocation: undefined,
      trialSessionId: undefined,
    });
  });
});
