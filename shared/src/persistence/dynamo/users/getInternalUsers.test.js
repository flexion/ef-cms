const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getInternalUsers } = require('./getInternalUsers');

applicationContext.filterCaseMetadata.mockImplementation(({ cases }) => cases);

describe('getInternalUsers', () => {
  beforeEach(() => {
    client.query = jest.fn().mockReturnValue([
      {
        pk: 'section|petitions',
        sk: 'user|petitionsclerk1',
        userId: 'petitionsclerk1',
      },
      {
        pk: 'section|docket',
        sk: 'user|docketclerk1',
        userId: 'docketclerk1',
      },
      {
        pk: 'section|adc',
        sk: 'user|adc1',
        userId: 'adc1',
      },
    ]);

    client.batchGet = jest.fn().mockReturnValue([
      {
        pk: 'user|petitionsclerk1',
        sk: 'user|petitionsclerk1',
        userId: 'petitionsclerk1',
      },
      {
        pk: 'user|docketclerk1',
        sk: 'user|docketclerk1',
        userId: 'docketclerk1',
      },
      {
        pk: 'user|adc1',
        sk: 'user|adc1',
        userId: 'adc1',
      },
    ]);
  });

  it('should get the internal users', async () => {
    const result = await getInternalUsers({
      applicationContext,
    });
    expect(result.length).toEqual(9);
  });
});
