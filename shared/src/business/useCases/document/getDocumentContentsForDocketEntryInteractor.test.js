const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getDocumentContentsForDocketEntryInteractor,
} = require('./getDocumentContentsForDocketEntryInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('getDocumentContentsForDocketEntryInteractor', () => {
  const mockDocumentContentsId = '599dbad3-4912-4a61-9525-3da245700893';
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Tasha Yar',
      role: ROLES.docketClerk,
    });

    applicationContext.getPersistenceGateway().getDocument.mockReturnValue(
      Buffer.from(
        JSON.stringify({
          documentContents: 'the contents!',
          richText: '<b>the contents!</b>',
        }),
      ),
    );
  });

  it('should throw an error when the logged in user does not have permission to VIEW_DOCUMENTS', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Tasha Yar',
      role: ROLES.inactivePractitioner,
    });

    await expect(
      getDocumentContentsForDocketEntryInteractor({
        applicationContext,
        documentContentsId: mockDocumentContentsId,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should call applicationContext.getPersistenceGateway().getDocument with documentCntentsId as the key', async () => {
    await getDocumentContentsForDocketEntryInteractor({
      applicationContext,
      documentContentsId: mockDocumentContentsId,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[0][0],
    ).toMatchObject({ key: mockDocumentContentsId });
  });

  it('should return the documentContents as parsed JSON data', async () => {
    const result = await getDocumentContentsForDocketEntryInteractor({
      applicationContext,
      documentContentsId: mockDocumentContentsId,
    });

    expect(result).toEqual({
      documentContents: 'the contents!',
      richText: '<b>the contents!</b>',
    });
  });

  it('should throw an error when the document contents cannot be found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockRejectedValue(
        new Error(
          `Document contents ${mockDocumentContentsId} could not be found in the S3 bucket.`,
        ),
      );

    await expect(
      getDocumentContentsForDocketEntryInteractor({
        applicationContext,
        documentContentsId: mockDocumentContentsId,
      }),
    ).rejects.toThrow(
      `Document contents ${mockDocumentContentsId} could not be found in the S3 bucket.`,
    );
  });
});
