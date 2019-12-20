import { getConsolidatedCasesByCaseInteractor } from './getConsolidatedCasesByCaseInteractor';

describe('getConsolidatedCasesByCaseInteractor', () => {
  let applicationContext;
  let getCasesByLeadCaseIdStub;
  let getUserMappingByConsolidatedCasesStub;

  beforeEach(() => {
    getCasesByLeadCaseIdStub = jest.fn().mockResolvedValue([
      { caseCaption: 'Guy Fieri vs. Bobby Flay', caseId: 'abc-123' },
      { caseCaption: 'Guy Fieri vs. Gordon Ramsay', caseId: 'def-321' },
    ]);

    getUserMappingByConsolidatedCasesStub = jest
      .fn()
      .mockResolvedValue([
        { caseCaption: 'Guy Fieri vs. Bobby Flay', sk: 'abc-123' },
      ]);

    applicationContext = {
      getPersistenceGateway: () => ({
        getCasesByLeadCaseId: getCasesByLeadCaseIdStub,
        getUserMappingByConsolidatedCases: getUserMappingByConsolidatedCasesStub,
      }),
    };
  });

  it('returns cases by the leadCaseId', async () => {
    const cases = await getConsolidatedCasesByCaseInteractor({
      applicationContext,
      leadCaseId: 'leadCaseId-123',
    });

    expect(getCasesByLeadCaseIdStub).toHaveBeenCalled();
    expect(cases).toEqual([
      {
        caseCaption: 'Guy Fieri vs. Bobby Flay',
        caseId: 'abc-123',
        isRequestingUserAssociated: true,
      },
      {
        caseCaption: 'Guy Fieri vs. Gordon Ramsay',
        caseId: 'def-321',
        isRequestingUserAssociated: false,
      },
    ]);
  });
});
