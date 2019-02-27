const assert = require('assert');
const sinon = require('sinon');
const { sendPetitionToIRS } = require('./sendPetitionToIRS.interactor');
const { getCase } = require('./getCase.interactor');
const { omit } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');

describe('Send petition to IRS', () => {
  let applicationContext;
  beforeEach(() => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          saveCase: () => Promise.resolve(MOCK_CASE),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
      environment: { stage: 'local' },
      irsGateway: {
        sendToIRS: () => Promise.resolve(),
      },
      getUseCases: () => ({ getCase }),
    };
  });

  it('throws unauthorized error if user is unauthorized', async () => {
    applicationContext.getCurrentUser = () => {
      return { userId: 'someuser' };
    };
    let error;
    try {
      await sendPetitionToIRS({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'someuser',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized for send to IRS');
  });

  it('throws invalid entity error if sendDate from irs gateway is invalid', async () => {
    let error;
    try {
      await sendPetitionToIRS({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'petitionsclerk',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Invalid for send to IRS');
  });

  it('case not found if caseId does not exist', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(null),
        };
      },
      environment: { stage: 'local' },
      getUseCases: () => ({ getCase }),
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
    };
    let error;
    try {
      await sendPetitionToIRS({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
    expect(error.message).toContain(
      'Case c54ba5a9-b37b-479d-9201-067ec6e335ba was not found',
    );
  });

  it('calls the irs gateway', async () => {
    let savedCaseRecord = Object.assign(MOCK_CASE);
    const date = '2018-12-04T18:27:13.370Z';
    const stub = sinon.stub().resolves(date);
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          saveCase: () => Promise.resolve(savedCaseRecord),
        };
      },
      environment: { stage: 'local' },
      irsGateway: {
        sendToIRS: stub,
      },
      getUseCases: () => ({ getCase }),
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
    };

    const irsSendDate = await sendPetitionToIRS({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      applicationContext,
    });
    assert.ok(irsSendDate);
    assert.equal(irsSendDate, date);
    assert.ok(stub.called);
  });

  it('handles error from the irs gateway', async () => {
    let savedCaseRecord = Object.assign(MOCK_CASE);
    const stub = sinon.stub().throws(new Error('test-error-string'));
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
          saveCase: () => Promise.resolve(savedCaseRecord),
        };
      },
      environment: { stage: 'local' },
      irsGateway: {
        sendToIRS: stub,
      },
      getUseCases: () => ({ getCase }),
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
    };
    let error;
    try {
      await sendPetitionToIRS({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
    expect(error.message).toContain(
      'error sending c54ba5a9-b37b-479d-9201-067ec6e335ba to IRS: test-error-string',
    );
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(omit(MOCK_CASE, 'documents')),
        };
      },
      environment: { stage: 'local' },
      irsGateway: {
        sendToIRS: () => {},
      },
      getUseCases: () => ({ getCase }),
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
    };
    let error;
    try {
      await sendPetitionToIRS({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "documents" fails because ["documents" must contain at least 1 items]',
    );
  });

  it('throws an error if the irs gateway returns an invalid date', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
        };
      },
      environment: { stage: 'local' },
      irsGateway: {
        sendToIRS: () => null,
      },
      getUseCases: () => ({ getCase }),
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
    };
    let error;
    try {
      await sendPetitionToIRS({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Invalid for send to IRS');
  });
});
