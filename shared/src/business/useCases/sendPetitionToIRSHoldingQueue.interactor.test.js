const assert = require('assert');
const {
  sendPetitionToIRSHoldingQueue,
} = require('./sendPetitionToIRSHoldingQueue.interactor');
const { getCase } = require('./getCase.interactor');
const { omit } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');
const User = require('../entities/User');
const Case = require('../entities/Case');

const MOCK_WORK_ITEMS = [
  {
    createdAt: '2018-12-27T18:06:02.971Z',
    assigneeName: 'IRSBatchSystem',
    caseStatus: 'Batched for IRS',
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    document: {
      documentType: Case.documentTypes.petitionFile,
      createdAt: '2018-12-27T18:06:02.968Z',
      documentId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
    },
    messages: [
      {
        createdAt: '2018-12-27T18:06:02.968Z',
        messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
        message: 'Petition ready for review',
        userId: 'taxpayer',
        role: 'petitioner',
        sentBy: 'Petitioner',
        sentTo: null,
      },
    ],
    section: 'petitions',
    workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
    assigneeId: null,
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    sentBy: 'petitioner',
    updatedAt: '2018-12-27T18:06:02.968Z',
    isInitializeCase: true,
  },
];
describe('Send petition to IRS Holding Queue', () => {
  let applicationContext;
  let mockCase;

  beforeEach(() => {
    mockCase = MOCK_CASE;
    mockCase.documents[0].workItems = MOCK_WORK_ITEMS;
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(mockCase),
          saveCase: ({ caseToSave }) => Promise.resolve(new Case(caseToSave)),
        };
      },
      environment: { stage: 'local' },
      getUseCases: () => ({ getCase }),
      getCurrentUser: () => {
        return new User({ userId: 'petitionsclerk', role: 'petitionsclerk' });
      },
    };
  });

  it('sets the case status to Batched for IRS', async () => {
    const result = await sendPetitionToIRSHoldingQueue({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      userId: 'petitionsclerk',
      applicationContext,
    });

    expect(result.status).toEqual('Batched for IRS');
  });

  it('throws unauthorized error if user is unauthorized', async () => {
    applicationContext.getCurrentUser = () => {
      return { userId: 'notauser' };
    };
    let error;
    try {
      await sendPetitionToIRSHoldingQueue({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'Unauthorized for send to IRS Holding Queue',
    );
  });

  it('case not found if caseId does not exist', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () => null,
          getCaseByCaseId: () => null,
        };
      },
      environment: { stage: 'local' },
      getUseCases: () => ({ getCase }),
      getCurrentUser: () => {
        return new User({ userId: 'petitionsclerk', role: 'petitionsclerk' });
      },
    };
    let error;
    try {
      await sendPetitionToIRSHoldingQueue({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        userId: 'petitionsclerk',
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

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(omit(MOCK_CASE, 'documents')),
        };
      },
      environment: { stage: 'local' },
      getUseCases: () => ({ getCase }),
      getCurrentUser: () => {
        return new User({ userId: 'petitionsclerk', role: 'petitionsclerk' });
      },
    };
    let error;
    try {
      await sendPetitionToIRSHoldingQueue({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'petitionsclerk',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "documents" fails because ["documents" must contain at least 1 items]',
    );
  });
});
