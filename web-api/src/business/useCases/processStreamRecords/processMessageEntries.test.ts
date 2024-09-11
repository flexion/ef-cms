import '@web-api/persistence/postgres/messages/mocks.jest';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { processMessageEntries } from './processMessageEntries';
import { upsertMessage } from '@web-api/persistence/postgres/messages/upsertMessage';

jest.mock('@web-api/persistence/postgres/messages/upsertMessage');

describe('processMessageEntries', () => {
  beforeEach(() => {
    (upsertMessage as jest.Mock).mockResolvedValue(undefined);
  });

  it('should attempt to store the messages using the upsert method', async () => {
    const mockRepliedToMessageRecord = {
      dynamodb: {
        NewImage: {
          docketNumber: {
            S: '123-45',
          },
          entityName: {
            S: 'Message',
          },
          isRepliedTo: {
            BOOL: true,
          },
          messageId: {
            S: 'a73c3ff5-2daf-4bbd-91d1-e8e7543346e0',
          },
          pk: {
            S: 'case|123-45',
          },
          sk: {
            S: 'message|229f79aa-22d1-426e-98e2-5d9f2af472b6',
          },
        },
      },
    };

    await processMessageEntries({
      applicationContext,
      messageRecords: [mockRepliedToMessageRecord],
    });

    expect(upsertMessage).toHaveBeenCalled();
  });
});
