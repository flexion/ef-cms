const { getCases } = require('./getCases.interactor');
const { omit } = require('lodash');

describe('getCases', () => {
  let applicationContext;

  let documents = [
    {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'stin',
    },
    {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'stin',
    },
    {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'stin',
    },
  ];

  let caseRecord = {
    userId: 'userId',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '45678-18',
    documents,
    createdAt: '',
  };

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => ({
        getUser: () => ({
          role: 'taxpayer',
        }),
        getCasesByUser: () => Promise.resolve([omit(caseRecord, 'documents')]),
      }),
    };
    let error;
    try {
      await getCases({
        userId: 'taxpayer',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => ({
        getUser: () => ({
          role: 'respondent',
        }),
        getCasesForRespondent: () =>
          Promise.resolve([omit(caseRecord, 'documents')]),
      }),
    };
    let error;
    try {
      await getCases({
        userId: 'respondent',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => ({
        getUser: () => ({
          role: 'petitionsclerk',
        }),
        getCasesByStatus: () =>
          Promise.resolve([omit(caseRecord, 'documents')]),
      }),
    };
    let error;
    try {
      await getCases({
        userId: 'petitionsclerk',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => ({
        getUser: () => ({
          role: 'intakeclerk',
        }),
        getCasesByStatus: () =>
          Promise.resolve([omit(caseRecord, 'documents')]),
      }),
    };
    let error;
    try {
      await getCases({
        userId: 'intakeclerk',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('The entity was invalid');
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => ({
        getUser: () => ({
          role: 'nonexistingrole',
        }),
        getCasesByStatus: () =>
          Promise.resolve([omit(caseRecord, 'documents')]),
      }),
    };
    let error;
    try {
      await getCases({
        userId: 'nonexistinguser',
        status: 'new',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('invalid user role');
  });
});
