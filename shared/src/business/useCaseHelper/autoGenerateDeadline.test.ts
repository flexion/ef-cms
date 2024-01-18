import { applicationContext } from '../test/createTestApplicationContext';
import { autoGenerateDeadline } from './autoGenerateDeadline';

describe('autoGenerateDeadline', () => {
  it('should create a case deadline', async () => {
    await autoGenerateDeadline({
      applicationContext,
      deadlineDate: '2019-03-01T21:42:29.073Z',
      description: 'Time is a created thing.',
      subjectCaseEntity: {
        associatedJudge: 'Laozi',
        associatedJudgeId: '2f5c2c79-4fb7-4a6b-9ea3-6142d8e17c09',
        docketNumber: '101-01',
        sortableDocketNumber: 2001000101,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createCaseDeadline.mock
        .calls[0][0].caseDeadline,
    ).toBeDefined();
  });
});
