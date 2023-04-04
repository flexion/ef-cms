const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateAssociatedJudgeOnWorkItems,
} = require('./updateAssociatedJudgeOnWorkItems');
const { faker } = require('@faker-js/faker');

describe('updateAssociatedJudgeOnWorkItems', () => {
  const workItemsResults = [
    { docketNumber: '101-20', pk: 'gotta', sk: 'cut', workItemId: 'abc' },
    { docketNumber: '101-20', pk: 'foot', sk: 'loose', workItemId: 'abc' },
  ];
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemsByWorkItemId.mockReturnValue(workItemsResults);
  });

  it('gets work items using the workItemId and calls update for each in the results', async () => {
    const workItemId = faker.datatype.uuid();
    const associatedJudge = 'Judge Kevin Bacon';

    await updateAssociatedJudgeOnWorkItems({
      applicationContext,
      associatedJudge,
      workItemId,
    });
    expect(
      applicationContext.getPersistenceGateway().getWorkItemsByWorkItemId,
    ).toHaveBeenCalledWith({ applicationContext, workItemId });

    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord,
    ).toHaveBeenCalledTimes(workItemsResults.length);

    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord
        .mock.calls[0][0],
    ).toMatchObject({
      applicationContext,
      attributeKey: 'associatedJudge',
      attributeValue: associatedJudge,
      pk: workItemsResults[0].pk,
      sk: workItemsResults[0].sk,
    });
    expect(
      applicationContext.getPersistenceGateway().updateAttributeOnDynamoRecord
        .mock.calls[1][0],
    ).toMatchObject({
      applicationContext,
      attributeKey: 'associatedJudge',
      attributeValue: associatedJudge,
      pk: workItemsResults[1].pk,
      sk: workItemsResults[1].sk,
    });
  });
});
