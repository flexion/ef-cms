const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteUserOutboxRecord } = require('./deleteUserOutboxRecord');

describe('deleteUserOutboxRecord', () => {
  let deleteStub;

  beforeEach(() => {
    deleteStub = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue(null),
    });
  });

  it('invokes the persistence layer with pk of user-incomplete-outbox|${userId} and sk of createdAt', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      delete: deleteStub,
    });
    await deleteUserOutboxRecord({
      applicationContext,
      createdAt: '2020-01-02T16:05:45.979Z',
      userId: '91414cfb-4fc9-440d-be07-a601e676fb6c',
    });

    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'user-incomplete-outbox|91414cfb-4fc9-440d-be07-a601e676fb6c',
        sk: '2020-01-02T16:05:45.979Z',
      },
    });
  });

  it('invokes the persistence layer with pk of user-complete-outbox|${userId} and sk of createdAt', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      delete: deleteStub,
    });
    await deleteUserOutboxRecord({
      applicationContext,
      completedAt: '2020-01-02T16:05:45.979Z',
      createdAt: '2020-01-02T16:05:45.979Z',
      userId: '91414cfb-4fc9-440d-be07-a601e676fb6c',
    });

    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'user-complete-outbox|91414cfb-4fc9-440d-be07-a601e676fb6c',
        sk: '2020-01-02T16:05:45.979Z',
      },
    });
  });
});
