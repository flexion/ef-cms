const { createCase } = require('./createCase.interactor');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');
const sinon = require('sinon');
const uuid = require('uuid');

describe('createCase', () => {
  let applicationContext;
  let documents = MOCK_DOCUMENTS;
  const MOCK_CASE_ID = '413f62ce-d7c8-446e-aeda-14a2a625a626';
  const MOCK_DOCKET_NUMBER = '00101-18';
  const DATE = '2018-11-21T20:49:28.192Z';

  beforeEach(() => {
    sinon.stub(uuid, 'v4').returns(MOCK_CASE_ID);
    sinon.stub(window.Date.prototype, 'toISOString').returns(DATE);
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
    uuid.v4.restore();
  });

  it('should create a case entity (with a generated caseId) and return it', async () => {
    const createCaseStub = sinon
      .stub()
      .callsFake(({ caseRecord }) => caseRecord);
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          createCase: createCaseStub,
        };
      },
      getUseCases: () => ({
        getUser: () => ({
          role: 'taxpayer',
          firstName: 'John',
          lastName: 'Doe',
        }),
      }),
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
    };

    const createdCase = await createCase({
      userId: 'taxpayer',
      documents: documents,
      applicationContext,
    });

    const expectedCaseRecordToPersist = {
      caseId: MOCK_CASE_ID,
      docketNumber: '00101-18',
      petitionerName: 'John Doe',
      documents: [
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Petition',
          createdAt: DATE,
          userId: 'taxpayer',
          validated: true,
          reviewDate: DATE,
          reviewUser: 'petitionsclerk',
          filedBy: 'John Doe',
        },
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Statement of Taxpayer Identification Number',
          createdAt: DATE,
          userId: 'taxpayer',
          validated: true,
          reviewDate: DATE,
          reviewUser: 'petitionsclerk',
          filedBy: 'John Doe',
        },
        {
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentType: 'Request for Place of Trial',
          createdAt: DATE,
          userId: 'taxpayer',
          validated: true,
          reviewDate: DATE,
          reviewUser: 'petitionsclerk',
          filedBy: 'John Doe',
        },
      ],
      createdAt: DATE,
      status: 'new',
      userId: 'taxpayer',
    };
    const caseRecordSentToPersistence = createCaseStub.getCall(0).args[0]
      .caseRecord;
    expect(createdCase).toEqual(expectedCaseRecordToPersist);
    expect(createdCase).toEqual(caseRecordSentToPersistence);
  });

  it('failure', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          createCase: () => Promise.reject(new Error('problem')),
        };
      },
      getUseCases: () => ({
        getUser: () => ({
          role: 'taxpayer',
          firstName: 'John',
          lastName: 'Doe',
        }),
      }),
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
    };
    try {
      await createCase({
        userId: 'petitionsclerk',
        documents: documents,
        applicationContext,
      });
    } catch (error) {
      expect(error.message).toEqual('problem');
    }
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          createCase: () =>
            Promise.resolve({
              docketNumber: '00101-00',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            }),
        };
      },
      getUseCases: () => ({
        getUser: () => ({
          role: 'taxpayer',
          firstName: 'John',
          lastName: 'Doe',
        }),
      }),
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await createCase({
        userId: 'taxpayer',
        documents,
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });
});
