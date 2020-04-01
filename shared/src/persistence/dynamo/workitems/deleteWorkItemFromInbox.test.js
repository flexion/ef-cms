const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteWorkItemFromInbox } = require('./deleteWorkItemFromInbox');

describe('deleteWorkItemFromInbox', () => {
  let deleteStub;

  beforeEach(() => {
    deleteStub = jest.fn().mockReturnValue({
      promise: async () => true,
    });
  });

  it('invokes the persistence layer with pk of {assigneeId}|workItem, docket|workItem and other expected params', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      delete: deleteStub,
    });
    await deleteWorkItemFromInbox({
      applicationContext,
      workItem: {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        section: 'docket',
        workItemId: '123',
      },
    });
    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'user|1805d1ab-18d0-43ec-bafb-654e83405416',
        sk: 'work-item|123',
      },
    });
    expect(deleteStub.mock.calls[1][0]).toMatchObject({
      Key: {
        pk: 'section|docket',
        sk: 'work-item|123',
      },
    });
  });

  it('invokes the persistence layer with pk of docket|workItem and other expected params when assigneeId is not set', async () => {
    applicationContext.getDocumentClient.mockReturnValue({
      delete: deleteStub,
    });
    await deleteWorkItemFromInbox({
      applicationContext,
      workItem: {
        section: 'docket',
        workItemId: '123',
      },
    });
    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'section|docket',
        sk: 'work-item|123',
      },
    });
  });
});
