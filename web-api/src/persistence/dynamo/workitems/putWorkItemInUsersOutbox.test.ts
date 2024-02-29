import { DOCKET_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createISODateString } from '../../../../../shared/src/business/utilities/DateHandler';
import { putWorkItemInUsersOutbox } from './putWorkItemInUsersOutbox';

describe('putWorkItemInUsersOutbox', () => {
  let putStub;
  let getStub;

  beforeEach(() => {
    putStub = jest.fn().mockResolvedValue({
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    getStub = jest.fn().mockResolvedValue({
      Item: {
        section: DOCKET_SECTION,
        userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
  });

  it('invokes the persistence layer with pk of user-outbox|{userId} and section-outbox|{section} and other expected params', async () => {
    const timestamp = createISODateString();
    applicationContext.getCurrentUser.mockReturnValue({
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getDocumentClient.mockReturnValue({
      get: getStub,
      put: putStub,
    });
    await putWorkItemInUsersOutbox({
      applicationContext,
      section: DOCKET_SECTION,
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      workItem: {
        completedAt: timestamp,
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[0][0].Item.pk).toBe(
      'user-outbox|1805d1ab-18d0-43ec-bafb-654e83405416',
    );
    expect(putStub.mock.calls[1][0].Item.pk).toBe('section-outbox|docket');

    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        sk: timestamp,
        ttl: expect.anything(),
        workItemId: '123',
      },
    });
    expect(putStub.mock.calls[1][0]).toMatchObject({
      Item: {
        sk: timestamp,
        ttl: expect.anything(),
        workItemId: '123',
      },
    });
  });
});
