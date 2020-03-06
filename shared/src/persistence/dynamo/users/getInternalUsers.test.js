const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');

const { getInternalUsers } = require('./getInternalUsers');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  isAuthorizedForWorkItems: () => true,
};

describe('getInternalUsers', () => {
  beforeEach(() => {
    sinon.stub(client, 'query').resolves([
      {
        pk: 'section|petitions',
        userId: 'petitionsclerk1',
      },
      {
        pk: 'section|docket',
        userId: 'docketclerk1',
      },
      {
        pk: 'section|adc',
        userId: 'adc1',
      },
    ]);

    sinon.stub(client, 'batchGet').resolves([
      {
        pk: 'section|petitions',
        userId: 'petitionsclerk1',
      },
      {
        pk: 'section|docket',
        userId: 'docketclerk1',
      },
      {
        pk: 'section|adc',
        userId: 'adc1',
      },
    ]);
  });

  afterEach(() => {
    client.query.restore();
  });

  it('should get the internal users', async () => {
    const result = await getInternalUsers({
      applicationContext,
    });
    expect(result.length).toEqual(9);
  });
});
