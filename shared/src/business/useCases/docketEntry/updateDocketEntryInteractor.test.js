const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateDocketEntryInteractor,
} = require('./updateDocketEntryInteractor');
const { User } = require('../../entities/User');

describe('updateDocketEntryInteractor', () => {
  const workItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    docketNumber: '45678-18',
    document: {
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentType: 'Answer',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    },
    isQC: true,
    section: 'docket',
    sentBy: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    updatedAt: new Date().toISOString(),
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  const caseRecord = {
    caseCaption: 'Caption',
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    caseType: 'Deficiency',
    contactPrimary: {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: 'domestic',
      email: 'fieri@example.com',
      name: 'Guy Fieri',
      phone: '1234567890',
      postalCode: '12345',
      state: 'CA',
    },
    createdAt: '',
    docketNumber: '45678-18',
    docketRecord: [
      {
        description: 'first record',
        docketRecordId: '8675309b-18d0-43ec-bafb-654e83405411',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        eventCode: 'P',
        filingDate: '2018-03-01T00:01:00.000Z',
        index: 1,
      },
    ],
    documents: [
      {
        docketNumber: '45678-18',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335b1',
        documentType: 'Answer',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItems: [workItem],
      },
      {
        docketNumber: '45678-18',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335b2',
        documentType: 'Answer',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItems: [workItem],
      },
      {
        docketNumber: '45678-18',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        workItems: [workItem],
      },
    ],
    filingType: 'Myself',
    partyType: 'Petitioner',
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    role: User.ROLES.petitioner,
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('updates the workitem without updating the document if no file is attached', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: User.ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: User.ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(caseRecord);

    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
          isFileAttached: false,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).not.toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).not.toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('adds documents and workitems', async () => {
    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
          isFileAttached: true,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });

  it('add documents but not workitems for paper filed documents', async () => {
    await expect(
      updateDocketEntryInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
          isPaper: true,
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).resolves.not.toThrow();

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).not.toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
  });
});
