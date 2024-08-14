import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseDeadlinesForCaseInteractor } from './getCaseDeadlinesForCaseInteractor';

describe('getCaseDeadlinesForCaseInteractor', () => {
  const mockCaseDeadline = {
    associatedJudge: 'Buch',
    associatedJudgeId: 'dabbad02-18d0-43ec-bafb-654e83405416',
    deadlineDate: '2019-03-01T21:42:29.073Z',
    description: 'hello world',
    docketNumber: '123-20',
  };

  it('gets the case deadlines', async () => {
    applicationContext.environment.stage = 'local';

    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([mockCaseDeadline]);
    applicationContext.getUniqueId.mockReturnValue(
      '6ba578e7-5736-435b-a41b-2de3eec29fe7',
    );

    const caseDeadlines = await getCaseDeadlinesForCaseInteractor(
      applicationContext,
      { docketNumber: mockCaseDeadline.docketNumber },
    );

    expect(caseDeadlines).toBeDefined();
  });
});
