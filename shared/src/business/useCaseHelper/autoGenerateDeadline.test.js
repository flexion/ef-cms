const { applicationContext } = require('../test/createTestApplicationContext');
const { autoGenerateDeadline } = require('./autoGenerateDeadline');

describe('autoGenerateDeadline', () => {
  it('should create a case deadline', async () => {
    await autoGenerateDeadline({
      applicationContext,
      deadlineDate: '2019-03-01T21:42:29.073Z',
      description: 'Time is a created thing.',
      subjectCaseEntity: {
        associatedJudge: 'Laozi',
        docketNumber: '101-01',
        sortableDocketNumber: '101-01',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().createCaseDeadline.mock
        .calls[0][0].caseDeadline,
    ).toBeDefined();
  });
});
