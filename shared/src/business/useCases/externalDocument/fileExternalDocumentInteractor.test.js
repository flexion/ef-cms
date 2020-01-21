const {
  fileExternalDocumentInteractor,
} = require('./fileExternalDocumentInteractor');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { User } = require('../../entities/User');

describe('fileExternalDocumentInteractor', () => {
  let globalUser;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    contactPrimary: {
      email: 'fieri@example.com',
      name: 'Guy Fieri',
    },
    createdAt: '',
    docketNumber: '45678-18',
    documents: [
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'respondent',
      },
    ],
    partyType: ContactFactory.PARTY_TYPES.petitioner,
    role: User.ROLES.petitioner,
    userId: 'petitioner',
  };

  const getCaseByCaseIdSpy = jest.fn().mockReturnValue(caseRecord);
  const saveWorkItemForNonPaperSpy = jest.fn();
  const updateCaseSpy = jest.fn();
  const sendServedPartiesEmailsSpy = jest.fn();

  const applicationContext = {
    environment: { stage: 'local' },
    getCurrentUser: () => globalUser,
    getPersistenceGateway: () => ({
      getCaseByCaseId: getCaseByCaseIdSpy,
      getUserById: ({ userId }) => MOCK_USERS[userId],
      saveWorkItemForNonPaper: saveWorkItemForNonPaperSpy,
      updateCase: updateCaseSpy,
    }),
    getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    getUseCaseHelpers: () => ({
      sendServedPartiesEmails: sendServedPartiesEmailsSpy,
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    globalUser = new User({
      name: 'Respondent',
      role: User.ROLES.respondent,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
  });

  it('should throw an error if not authorized', async () => {
    globalUser = {
      name: 'adc',
      role: User.ROLES.adc,
      userId: 'g7d90c05-f6cd-442c-a168-202db587f16f',
    };

    let error;
    try {
      await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should add documents and workitems and auto-serve the documents on the parties with an electronic service indicator', async () => {
    let error;

    let updatedCase;
    try {
      updatedCase = await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy).toBeCalled();
    expect(saveWorkItemForNonPaperSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(sendServedPartiesEmailsSpy).toHaveBeenCalled();
    expect(updatedCase.documents[3].status).toEqual('served');
    expect(updatedCase.documents[3].servedAt).toBeDefined();
  });

  it('should add documents and workitems but NOT auto-serve Simultaneous documents on the parties', async () => {
    let error;

    let updatedCase;
    try {
      updatedCase = await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentTitle: 'Amended Simultaneous Memoranda of Law',
          documentType: 'Amended Simultaneous Memoranda of Law',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(getCaseByCaseIdSpy).toBeCalled();
    expect(saveWorkItemForNonPaperSpy).toBeCalled();
    expect(updateCaseSpy).toBeCalled();
    expect(sendServedPartiesEmailsSpy).not.toHaveBeenCalled();
    expect(updatedCase.documents[3].status).toBeUndefined();
    expect(updatedCase.documents[3].servedAt).toBeUndefined();
  });
});
