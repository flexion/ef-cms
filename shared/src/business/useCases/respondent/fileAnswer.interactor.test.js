const { fileAnswer } = require('./fileAnswer.interactor');
const sinon = require('sinon');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');

const MOCK_USER = {
  userId: 'respondent',
  firstName: 'john',
  lastName: 'doe',
  barNumber: '12345',
  email: 'respondent@example.net',
  isIRSAttorney: true,
  middleName: 'rick',
  phone: '111-111-1111',
  title: 'mr',
  address: '123',
};

describe('fileAnswer', () => {
  let applicationContext;
  let documents = MOCK_DOCUMENTS;

  it('should attach the respondent information to the case when calling updateCase', async () => {
    const updateCaseStub = sinon.stub().resolves({
      docketNumber: '00101-18',
      caseId: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      documents,
    });
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          uploadDocument: () =>
            Promise.resolve('a6b81f4d-1e47-423a-8caf-6d2fdc3d3859'),
        };
      },
      getUseCases: () => {
        return {
          updateCase: updateCaseStub,
          getUser: () => Promise.resolve(MOCK_USER),
        };
      },
      environment: { stage: 'local' },
    };
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
    expect(updateCaseStub.getCall(0).args[0].caseDetails.respondent).toEqual({
      userId: 'respondent',
      firstName: 'john',
      lastName: 'doe',
      middleName: 'rick',
      barNumber: '12345',
      email: 'respondent@example.net',
      phone: '111-111-1111',
      title: 'mr',
      isIRSAttorney: true,
      address: '123',
    });
  });

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
      getPersistenceGateway: () => {
        return {
          uploadDocument: () => Promise.resolve('abc'),
        };
      },
      environment: { stage: 'local' },
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
    expect(error.message).toContain(
      'The entity was invalid ValidationError: child',
    );
  });

  it('throws an error is the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          uploadDocument: () =>
            Promise.resolve('a6b81f4d-1e47-423a-8caf-6d2fdc3d3859'),
        };
      },
      getUseCases: () => {
        return {
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
        };
      },
      environment: { stage: 'local' },
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
    expect(error.message).toContain('The entity was invalid');
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
