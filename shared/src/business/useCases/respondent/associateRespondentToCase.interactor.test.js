const {
  associateRespondentToCase,
} = require('./associateRespondentToCase.interactor');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const documents = MOCK_DOCUMENTS;
const sinon = require('sinon');
const DATE = '2018-11-21T20:49:28.192Z';

describe('associateRespondentToCase', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(DATE);
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('should throw an error if the user is not authorized', async () => {
    let error;
    try {
      await associateRespondentToCase({
        userId: 'notavaliduser',
        caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        applicationContext: null,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized for getCasesByStatus');
  });

  it('should throw an error if the user is not authorized', async () => {
    applicationContext = {
      getUseCases: () => ({
        getCase: () => ({
          docketNumber: '00101-00',
          petitionerName: 'John Doe',
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documents,
        }),
        getUser: () => ({
          userId: 'respondent',
          firstName: 'John',
          lastName: 'Doe',
          middleName: 'Rick',
          title: 'Mr.',
          barNumber: '12345',
        }),
        updateCase: () => null,
      }),
      getPersistenceGateway: () => ({
        createRespondentCaseMapping: () => null,
      }),
    };
    const response = await associateRespondentToCase({
      userId: 'respondent',
      caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      applicationContext,
    });
    expect(response).toEqual({
      createdAt: DATE,
    });
  });
});
