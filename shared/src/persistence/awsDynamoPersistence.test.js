const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));
const sinon = require('sinon');
const client = require('ef-cms-shared/src/persistence/dynamodbClientService');

const { incrementCounter } = require('./awsDynamoPersistence');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

describe('awsDynamoPersistence', function() {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'new',
    });
    sinon.stub(client, 'put').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'new',
    });
    sinon.stub(client, 'delete').resolves({
      pk: '123',
      sk: '123',
      caseId: '123',
      status: 'new',
    });
    sinon.stub(client, 'batchGet').resolves([
      {
        pk: '123',
        sk: '123',
        caseId: '123',
        status: 'new',
      },
    ]);
    sinon.stub(client, 'query').resolves([
      {
        pk: '123',
        sk: '123',
      },
    ]);
    sinon.stub(client, 'batchWrite').resolves(null);
    sinon.stub(client, 'updateConsistent').resolves(null);
  });

  afterEach(() => {
    client.get.restore();
    client.delete.restore();
    client.put.restore();
    client.query.restore();
    client.batchGet.restore();
    client.batchWrite.restore();
    client.updateConsistent.restore();
  });

  describe('incrementCounter', () => {
    it('should invoke the correct client updateConsistence method using the correct pk and sk', async () => {
      await incrementCounter({ applicationContext });
      expect(client.updateConsistent.getCall(0).args[0].Key.pk).to.equal(
        'docketNumberCounter',
      );
      expect(client.updateConsistent.getCall(0).args[0].Key.sk).to.equal(
        'docketNumberCounter',
      );
    });
  });
});
