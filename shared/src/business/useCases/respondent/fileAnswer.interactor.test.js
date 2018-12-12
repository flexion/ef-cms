const { fileAnswer } = require('./fileAnswer.interactor');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');

describe('fileAnswer', () => {
  let applicationContext;
  let documents = MOCK_DOCUMENTS;

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getUseCases: () => ({
        getUser: () =>
          Promise.resolve({
            firstName: 'bob',
            lastName: 'marley',
            barNumber: '12345',
          }),
      }),
      getPersistenceGateway: () => ({
        createRespondentCaseMapping: () => null,
        uploadDocument: () => Promise.resolve('abc'),
      }),
    };
    let error;
    try {
      await fileAnswer({
        answerDocument: 'abc',
        userId: 'respondent',
        caseToUpdate: {
          documents,
          docketNumber: '00101-18',
          caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('cannot process ValidationError: child');
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        createRespondentCaseMapping: () => null,
        uploadDocument: () =>
          Promise.resolve('a6b81f4d-1e47-423a-8caf-6d2fdc3d3859'),
      }),
      getUseCases: () => ({
        updateCase: () =>
          Promise.resolve({
            docketNumber: '00101-18',
            caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          }),
        getUser: () =>
          Promise.resolve({
            firstName: 'bob',
            lastName: 'marley',
            barNumber: '12345',
          }),
      }),
    };
    let error;
    try {
      await fileAnswer({
        answerDocument: 'abc',
        userId: 'respondent',
        caseToUpdate: {
          documents,
          docketNumber: '00101-18',
          caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('cannot process ValidationError: child');
  });

  it('throws an error if an answerDocument is not provided', async () => {
    let error;
    try {
      await fileAnswer({
        userId: 'respondent',
        caseToUpdate: {
          documents,
          docketNumber: '00101-18',
          caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        },
        applicationContext: null, // not needed since the implementation should error before needing it
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'answer document cannot be null or invalid',
    );
  });
});
