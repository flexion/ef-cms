const { deleteSectionOutboxRecord } = require('./deleteSectionOutboxRecord');

describe('deleteSectionOutboxRecord', () => {
  let deleteStub;

  beforeEach(() => {
    deleteStub = jest.fn().mockReturnValue({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer with pk of section-outbox-${section} and sk of createdAt', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
      }),
    };
    await deleteSectionOutboxRecord({
      applicationContext,
      createdAt: '2020-01-02T16:05:45.979Z',
      section: 'docket',
    });
    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'section-outbox|docket',
        sk: '2020-01-02T16:05:45.979Z',
      },
    });
  });
});
