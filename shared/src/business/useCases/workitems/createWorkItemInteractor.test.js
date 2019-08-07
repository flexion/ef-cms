const sinon = require('sinon');
const { createWorkItemInteractor } = require('./createWorkItemInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('createWorkItem', () => {
  let createWorkItemStub;
  let updateCaseStub;

  beforeEach(() => {
    createWorkItemStub = sinon.stub().resolves(null);
    updateCaseStub = sinon.stub().resolves(null);
  });

  const createApplicationContext = overrides => ({
    environment: { stage: 'local' },
    getCurrentUser: () => ({
      name: 'Tax Payer',
      role: 'petitioner',
      section: 'petitions',
      userId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
    }),
    getPersistenceGateway: () => ({
      createWorkItem: createWorkItemStub,
      getCaseByCaseId: () => MOCK_CASE,
      getUserById: () => ({
        name: 'docketclerk',
        role: 'docketclerk',
        section: 'docket',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
      updateCase: updateCaseStub,
    }),
    ...overrides,
  });

  it('throws an error when an unauthorized user tries to invoke the createWorkItem interactor', async () => {
    const applicationContext = createApplicationContext();
    let error;
    try {
      await createWorkItemInteractor({
        applicationContext,
        assigneeId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
        caseId: 'b54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        message: 'testing',
      });
    } catch (e) {
      error = e;
    }
    expect(error.message).toEqual('Unauthorized for create workItem');
  });

  it('attempts to invoke createWorkItem with the expected workItem', async () => {
    const applicationContext = createApplicationContext({
      getCurrentUser: () => ({
        name: 'Docketclerk',
        role: 'docketclerk',
        section: 'docket',
        userId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    });
    await createWorkItemInteractor({
      applicationContext,
      assigneeId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseId: 'b54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      message: 'testing',
    });
    expect(createWorkItemStub.calledOnce).toBeTruthy();
    expect(createWorkItemStub.getCall(0).args[0].workItem).toMatchObject({
      assigneeId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      assigneeName: 'docketclerk',
      caseId: 'b54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseStatus: 'New',
      docketNumber: '101-18',
      docketNumberSuffix: undefined,
      document: {
        documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Answer',
      },
      isInitializeCase: false,
      messages: [
        {
          from: 'Docketclerk',
          fromUserId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
          message: 'testing',
          to: 'docketclerk',
          toUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      ],
      section: 'docket',
      sentBy: 'Docketclerk',
      sentByUserId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('attempts to invoke updateCase with the expected caseToUpdate argument', async () => {
    const applicationContext = createApplicationContext({
      getCurrentUser: () => ({
        name: 'Docketclerk',
        role: 'docketclerk',
        section: 'docket',
        userId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    });
    await createWorkItemInteractor({
      applicationContext,
      assigneeId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseId: 'b54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      message: 'testing',
    });
    expect(updateCaseStub.calledOnce).toBeTruthy();
    expect(
      updateCaseStub.getCall(0).args[0].caseToUpdate.documents[2].workItems[0],
    ).toMatchObject({
      assigneeId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      assigneeName: 'docketclerk',
      caseId: 'b54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseStatus: 'New',
      docketNumber: '101-18',
      docketNumberSuffix: undefined,
      document: {
        documentId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentType: 'Answer',
      },
      isInitializeCase: false,
      messages: [
        {
          from: 'Docketclerk',
          fromUserId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
          message: 'testing',
          to: 'docketclerk',
          toUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      ],
      section: 'docket',
      sentBy: 'Docketclerk',
      sentByUserId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
