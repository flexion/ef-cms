const {
  addDraftStampOrderDocketEntryInteractor,
} = require('./addDraftStampOrderDocketEntryInteractor');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  MOTION_DISPOSITIONS,
  ORDER_TYPES,
  PETITIONS_SECTION,
} = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');

describe('addDraftStampOrderDocketEntryInteractor', () => {
  const mockSigningName = 'Guy Fieri';
  const mockStampedDocketEntryId = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3858';
  const mockOriginalDocketEntryId = 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859';
  const mockParentMessageId = 'b3bc3773-6ddd-439d-a3c9-60d6beceff99';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('should add a draft order docket entry to the case', async () => {
    await addDraftStampOrderDocketEntryInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      formattedDraftDocumentTitle:
        'some title with disposition and custom text',
      originalDocketEntryId: mockOriginalDocketEntryId,
      stampData: {
        disposition: MOTION_DISPOSITIONS.GRANTED,
        nameForSigning: mockSigningName,
      },
      stampedDocketEntryId: mockStampedDocketEntryId,
    });

    const { caseToUpdate } =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0];

    expect(caseToUpdate.docketEntries.length).toEqual(
      MOCK_DOCUMENTS.length + 1,
    );
    const draftOrder = caseToUpdate.docketEntries.find(
      e => e.documentType === ORDER_TYPES[0].documentType,
    );
    expect(draftOrder.docketNumber).toEqual(caseToUpdate.docketNumber);

    const draftDocketEntryEntity = caseToUpdate.docketEntries.find(
      doc =>
        doc.documentType === ORDER_TYPES[0].documentType &&
        doc.docketEntryId === mockStampedDocketEntryId,
    );

    expect(draftDocketEntryEntity.docketEntryId).toEqual(
      mockStampedDocketEntryId,
    );
    expect(draftDocketEntryEntity.isDraft).toEqual(true);
    const motionDocumentType = MOCK_CASE.docketEntries.find(
      e => e.docketEntryId === mockOriginalDocketEntryId,
    ).documentType;
    expect(draftDocketEntryEntity.freeText).toEqual(
      `${motionDocumentType} some title with disposition and custom text`,
    );
    expect(draftDocketEntryEntity.signedJudgeName).toEqual(mockSigningName);
    expect(draftDocketEntryEntity.documentType).toEqual(
      ORDER_TYPES[0].documentType,
    );
  });

  it('should add the stamped document to the latest message if parentMessageId is included', async () => {
    applicationContext
      .getPersistenceGateway()
      .getMessageThreadByParentId.mockReturnValue([
        {
          caseStatus: MOCK_CASE.status,
          caseTitle: 'Test Petitioner',
          createdAt: '2019-03-01T21:40:46.415Z',
          docketNumber: MOCK_CASE.docketNumber,
          docketNumberWithSuffix: MOCK_CASE.docketNumber,
          from: 'Test Petitionsclerk',
          fromSection: PETITIONS_SECTION,
          fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
          message: 'hey there',
          messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
          parentMessageId: mockParentMessageId,
          subject: 'hello',
          to: 'Test Petitionsclerk2',
          toSection: PETITIONS_SECTION,
          toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
        },
      ]);

    await addDraftStampOrderDocketEntryInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      formattedDraftDocumentTitle:
        'some title with disposition and custom text',
      originalDocketEntryId: mockOriginalDocketEntryId,
      parentMessageId: mockParentMessageId,
      stampData: {
        disposition: MOTION_DISPOSITIONS.GRANTED,
        nameForSigning: mockSigningName,
      },
      stampedDocketEntryId: mockStampedDocketEntryId,
    });

    expect(
      applicationContext.getPersistenceGateway().updateMessage,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateMessage.mock.calls[0][0]
        .message,
    ).toMatchObject({
      attachments: [
        {
          documentId: mockStampedDocketEntryId,
        },
      ],
    });
  });
});
