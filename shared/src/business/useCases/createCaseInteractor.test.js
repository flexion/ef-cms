const { createCase } = require('./createCaseInteractor');
const sinon = require('sinon');
const uuid = require('uuid');
const User = require('../entities/User');
const PetitionWithoutFiles = require('../entities/PetitionWithoutFiles');

describe('createCase', () => {
  let applicationContext;
  const MOCK_CASE_ID = '413f62ce-d7c8-446e-aeda-14a2a625a626';
  const MOCK_DOCKET_NUMBER = '101-18';
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
    const saveCaseStub = sinon.stub().callsFake(({ caseToSave }) => caseToSave);
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: saveCaseStub,
        };
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getCurrentUser: () => {
        return new User({
          userId: 'taxpayer',
          role: 'petitioner',
          name: 'Test Taxpayer',
        });
      },
      getUseCases: () => ({
        getUser: () => ({
          address: '123',
          email: 'test@example.com',
          name: 'Test Taxpayer',
          phone: '(123) 456-7890',
          role: 'petitioner',
        }),
      }),
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
    };

    const createdCase = await createCase({
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        partyType: 'Petitioner',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: DATE,
      },
      ownershipDisclosureFileId: '413f62ce-7c8d-446e-aeda-14a2a625a626',
      applicationContext,
    });

    const expectedCaseRecordToPersist = {
      caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      caseType: 'other',
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      docketRecord: [
        {
          filingDate: '2018-11-21T20:49:28.192Z',
          description: 'Request for Place of Trial at Chattanooga, TN',
        },
        {
          description: 'Petition',
          filedBy: 'Petitioner',
          filingDate: '2018-11-21T20:49:28.192Z',
          status: undefined,
        },
        {
          description: 'Ownership Disclosure Statement',
          filedBy: 'Petitioner',
          filingDate: '2018-11-21T20:49:28.192Z',
          status: undefined,
        },
      ],
      documents: [
        {
          caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          documentType: 'Petition',
          filedBy: 'Petitioner',
          userId: 'taxpayer',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
              caseStatus: 'New',
              createdAt: '2018-11-21T20:49:28.192Z',
              docketNumber: '101-18',
              docketNumberSuffix: 'S',
              document: {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                documentType: 'Petition',
                filedBy: 'Petitioner',
                userId: 'taxpayer',
                workItems: [],
              },
              messages: [
                {
                  createdAt: '2018-11-21T20:49:28.192Z',
                  message:
                    'A Petition filed by Petitioner is ready for review.',
                  messageId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                  sentBy: 'Test Taxpayer',
                },
              ],
              section: 'petitions',
              sentBy: 'taxpayer',
              updatedAt: '2018-11-21T20:49:28.192Z',
              workItemId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
            },
          ],
        },
        {
          caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: '413f62ce-7c8d-446e-aeda-14a2a625a626',
          documentType: 'Ownership Disclosure Statement',
          filedBy: 'Petitioner',
          userId: 'taxpayer',
          workItems: [],
        },
      ],
      hasIrsNotice: true,
      irsNoticeDate: '2018-11-21T20:49:28.192Z',
      petitioners: [
        {
          name: 'Test Taxpayer',
          section: undefined,
          userId: 'taxpayer',
        },
      ],
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      filingType: 'Myself',
      partyType: 'Petitioner',
      status: 'New',
      userId: 'taxpayer',
    };
    const caseRecordSentToPersistence = saveCaseStub.getCall(0).args[0]
      .caseToSave;
    expect(createdCase).toMatchObject(expectedCaseRecordToPersist);
    expect(createdCase).toMatchObject(caseRecordSentToPersistence);
  });

  it('should create a case entity without a irsNoticeDate and return it', async () => {
    const saveCaseStub = sinon.stub().callsFake(({ caseToSave }) => caseToSave);
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: saveCaseStub,
        };
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getCurrentUser: () => {
        return new User({
          userId: 'taxpayer',
          role: 'petitioner',
          name: 'Test Taxpayer',
        });
      },
      getUseCases: () => ({
        getUser: () => ({
          address: '123',
          email: 'test@example.com',
          name: 'test taxpayer',
          phone: '(123) 456-7890',
        }),
      }),
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve(MOCK_DOCKET_NUMBER),
      },
    };

    const createdCase = await createCase({
      petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      petitionMetadata: {
        caseType: 'other',
        procedureType: 'Small',
        filingType: 'Myself',
        partyType: 'Petitioner',
        preferredTrialCity: 'Chattanooga, TN',
        hasIrsNotice: true,
        irsNoticeDate: DATE,
      },
      applicationContext,
    });

    const expectedCaseRecordToPersist = {
      caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
      caseType: 'other',
      createdAt: '2018-11-21T20:49:28.192Z',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      documents: [
        {
          caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          createdAt: '2018-11-21T20:49:28.192Z',
          documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
          documentType: 'Petition',
          filedBy: 'Petitioner',
          userId: 'taxpayer',
          workItems: [
            {
              assigneeId: null,
              assigneeName: null,
              caseId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
              caseStatus: 'New',
              createdAt: '2018-11-21T20:49:28.192Z',
              docketNumber: '101-18',
              docketNumberSuffix: 'S',
              document: {
                createdAt: '2018-11-21T20:49:28.192Z',
                documentId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                documentType: 'Petition',
                filedBy: 'Petitioner',
                userId: 'taxpayer',
                workItems: [],
              },
              messages: [
                {
                  createdAt: '2018-11-21T20:49:28.192Z',
                  message:
                    'A Petition filed by Petitioner is ready for review.',
                  messageId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
                  sentBy: 'Test Taxpayer',
                },
              ],
              section: 'petitions',
              sentBy: 'taxpayer',
              updatedAt: '2018-11-21T20:49:28.192Z',
              workItemId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
            },
          ],
        },
      ],
      hasIrsNotice: true,
      irsNoticeDate: '2018-11-21T20:49:28.192Z',
      petitioners: [
        {
          name: 'Test Taxpayer',
          section: undefined,
          userId: 'taxpayer',
        },
      ],
      preferredTrialCity: 'Chattanooga, TN',
      procedureType: 'Small',
      filingType: 'Myself',
      partyType: 'Petitioner',
      status: 'New',
      userId: 'taxpayer',
    };
    const caseRecordSentToPersistence = saveCaseStub.getCall(0).args[0]
      .caseToSave;
    expect(createdCase).toMatchObject(expectedCaseRecordToPersist);
    expect(createdCase).toMatchObject(caseRecordSentToPersistence);
  });

  it('failure', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () => Promise.reject(new Error('problem')),
        };
      },
      getCurrentUser: () => {
        return new User({
          userId: 'taxpayer',
          role: 'petitioner',
          name: 'Test Taxpayer',
        });
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getUseCases: () => ({
        getUser: () => ({
          name: 'john doe',
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        }),
      }),
      environment: { stage: 'local' },
      docketNumberGenerator: {
        createDocketNumber: () => Promise.resolve('00101-00'),
      },
    };
    try {
      await createCase({
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseType: 'other',
          procedureType: 'Small',
          filingType: 'Myself',
          partyType: 'Petitioner',
          preferredTrialCity: 'Chattanooga, TN',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
        },
        applicationContext,
      });
    } catch (error) {
      expect(error.message).toEqual('problem');
    }
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () =>
            Promise.resolve({
              docketNumber: '00101-00',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            }),
        };
      },
      getEntityConstructors: () => ({
        Petition: PetitionWithoutFiles,
      }),
      getCurrentUser: () => {
        return new User({ userId: 'taxpayer', role: 'petitioner' });
      },
      getUseCases: () => ({
        getUser: () => ({
          name: 'john doe',
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
        petitionFileId: null,
        petitionMetadata: {
          caseType: 'other',
          procedureType: 'Small',
          filingType: 'Myself',
          partyType: 'Petitioner',
          preferredTrialCity: 'Chattanooga, TN',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
        },
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The Document entity was invalid');
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return {};
      },
    };
    let error;
    try {
      await createCase({
        petitionFileId: '413f62ce-d7c8-446e-aeda-14a2a625a626',
        petitionMetadata: {
          caseType: 'other',
          procedureType: 'Small',
          filingType: 'Myself',
          partyType: 'Petitioner',
          preferredTrialCity: 'Chattanooga, TN',
          hasIrsNotice: true,
          irsNoticeDate: DATE,
        },
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });
});
