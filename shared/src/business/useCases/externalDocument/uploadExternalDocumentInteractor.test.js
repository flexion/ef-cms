const {
  uploadExternalDocumentInteractor,
} = require('./uploadExternalDocumentInteractor');

describe('uploadExternalDocumentInteractor', () => {
  let applicationContext;

  let caseRecord = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    role: 'petitioner',
    userId: 'taxpayer',
  };

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => ({
        uploadDocument: async () => caseRecord,
      }),
      getUseCases: () => ({
        fileExternalDocumentInteractor: () => {},
      }),
    };
    let error;
    try {
      await uploadExternalDocumentInteractor({
        applicationContext,
        documentMetadata: {},
        documentFiles: [
          {
            primary: 'something',
          }
        ]
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('runs successfully with no errors with minimum data and valid user', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            role: 'respondent',
            userId: 'respondent',
          };
        },
        getPersistenceGateway: () => ({
          uploadDocument: async () => caseRecord,
        }),
        getUseCases: () => ({
          fileExternalDocumentInteractor: () => {},
          sanitizePdfInteractor: () => null,
          validatePdfInteractor: () => null,
          virusScanPdfInteractor: () => null,
        }),
      };
      await uploadExternalDocumentInteractor({
        applicationContext,
        documentMetadata: {},
        documentFiles: {
          primary: 'something',
        },
        progressFunctions: {
          primary: 'something',
        }
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });

  it('runs successfully with no errors with all data and valid user', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            role: 'respondent',
            userId: 'respondent',
          };
        },
        getPersistenceGateway: () => ({
          uploadDocument: async () => caseRecord,
        }),
        getUseCases: () => ({
          fileExternalDocumentInteractor: () => {},
          sanitizePdfInteractor: () => null,
          validatePdfInteractor: () => null,
          virusScanPdfInteractor: () => null,
        }),
      };
      await uploadExternalDocumentInteractor({
        applicationContext,
        documentMetadata: {},
        documentFiles: {
          primary: 'something',
          secondary: 'something2',
          primarySupporting0: 'something3',
          secondarySupporting0: 'something4'
        },
        progressFunctions: {
          primary: 'something',
          secondary: 'something2',
          primarySupporting0: 'something3',
          secondarySupporting0: 'something4'
        }
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });

  it('runs successfully with no errors with all data and valid user who is a practitioner', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            role: 'practitioner',
            userId: 'practitioner',
          };
        },
        getPersistenceGateway: () => ({
          uploadDocument: async () => caseRecord,
        }),
        getUseCases: () => ({
          fileExternalDocumentInteractor: () => {},
          sanitizePdfInteractor: () => null,
          validatePdfInteractor: () => null,
          virusScanPdfInteractor: () => null,
        }),
      };
      await uploadExternalDocumentInteractor({
        applicationContext,
        documentMetadata: {},
        documentFiles: {
          primary: 'something',
          secondary: 'something2',
          primarySupporting0: 'something3',
          secondarySupporting0: 'something4'
        },
        progressFunctions: {
          primary: 'something',
          secondary: 'something2',
          primarySupporting0: 'something3',
          secondarySupporting0: 'something4'
        }
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
  });
});
