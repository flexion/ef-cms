import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getConsolidatedCasesByCaseAction } from './getConsolidatedCasesByCaseAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getConsolidatedCasesByCaseAction', () => {
  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getConsolidatedCasesByCaseInteractor.mockResolvedValue([
        {
          caseId: 'case-id-123',
          docketNumber: '100-19',
          leadCaseId: 'case-id-123',
        },
        {
          caseId: 'case-id-234',
          docketNumber: '102-19',
          leadCaseId: 'case-id-123',
        },
        {
          caseId: 'case-id-345',
          docketNumber: '111-19',
          leadCaseId: 'case-id-123',
        },
      ]);

    presenter.providers.applicationContext = applicationContext;
  });

  it("gets the consolidated cases by the case's lead case", async () => {
    const { output } = await runAction(getConsolidatedCasesByCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {
          leadCaseId: 'case-id-123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getConsolidatedCasesByCaseInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(output.consolidatedCases).toEqual([
      {
        caseId: 'case-id-123',
        docketNumber: '100-19',
        leadCaseId: 'case-id-123',
      },
      {
        caseId: 'case-id-234',
        docketNumber: '102-19',
        leadCaseId: 'case-id-123',
      },
      {
        caseId: 'case-id-345',
        docketNumber: '111-19',
        leadCaseId: 'case-id-123',
      },
    ]);
  });

  it('does not try to retrieve consolidated cases if it has no lead case', async () => {
    await runAction(getConsolidatedCasesByCaseAction, {
      modules: { presenter },
      state: {
        caseDetail: {},
      },
    });

    expect(
      applicationContext.getUseCases().getConsolidatedCasesByCaseInteractor.mock
        .calls.length,
    ).toEqual(0);
  });
});
