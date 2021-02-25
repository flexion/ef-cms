const { migrateItems } = require('./0023-update-outbox-pks');

describe('migrateItems', () => {
  it('only migrates user-outbox work items', async () => {
    const items = [
      {
        completedAt: '123',
        defintelyNotWorkItemId: '123',
        pk: 'definitely-not-a-work-item|1234',
        sk: 'user-outbox|123',
      },
      {
        completedAt: '123',
        pk: 'user-outbox|234',
        sk: 'anything|234',
        workItemId: '234',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toMatchObject([
      {
        completedAt: '123',
        defintelyNotWorkItemId: '123',
        pk: 'definitely-not-a-work-item|1234',
        sk: 'user-outbox|123',
      },
      {
        completedAt: '123',
        pk: 'user-complete-outbox|234',
        sk: 'anything|234',
        workItemId: '234',
      },
    ]);
  });

  it('updates the pk for a user outbox work item to reflect its completed state', async () => {
    const items = [
      {
        pk: 'user-outbox|123',
        sk: 'anything|123',
        workItemId: '123',
      },
      {
        completedAt: '123',
        pk: 'user-outbox|234',
        sk: 'anything|234',
        workItemId: '234',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toMatchObject([
      {
        pk: 'user-incomplete-outbox|123', // does not have completedAt
        sk: 'anything|123',
        workItemId: '123',
      },
      {
        completedAt: '123',
        pk: 'user-complete-outbox|234',
        sk: 'anything|234',
        workItemId: '234',
      },
    ]);
  });
});
