const { applicationContext } = require('../test/createTestApplicationContext');
const { getNotificationsInteractor } = require('./getNotificationsInteractor');

describe('getNotificationsInteractor', () => {
  it('returns an unread count for my messages', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: 'abc',
    });
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        {
          isRead: true,
        },
      ]);

    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ qcUnreadCount: 0 });
  });

  it('returns an unread count for qc messages', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        {
          isRead: false,
        },
      ]);

    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ qcUnreadCount: 1 });
  });

  it('returns an accurate unread count for legacy items marked complete', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        {
          isRead: true,
        },
      ]);

    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({ qcUnreadCount: 0 });
  });
});
