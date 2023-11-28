import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { deleteDocumentFile } from './deleteDocumentFile';

describe('deleteDocumentFile', () => {
  applicationContext.environment.documentsBucketName = 'aBucket';

  applicationContext.getStorageClient().deleteObject.mockResolvedValue({});

  it('deletes the document', async () => {
    await deleteDocumentFile({
      applicationContext,
      key: 'deleteThisDocument',
    });

    expect(
      applicationContext.getStorageClient().deleteObject.mock.calls[0][0],
    ).toMatchObject({
      Bucket: 'aBucket',
      Key: 'deleteThisDocument',
    });
  });
});
