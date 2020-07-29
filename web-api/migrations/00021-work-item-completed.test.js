const { forAllRecords } = require('./utilities');
const { up } = require('./00021-work-item-completed');

describe('updates sk on outbox records from createdAt to completedAt', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = {};

  const items = [
    {
      completedAt: '2019-10-01T21:40:46.415Z',
      createdAt: '2019-03-01T21:40:46.415Z',
      pk: 'user-outbox|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      section: 'docket',
      sk: '2019-03-01T21:40:46.415Z',
    },
    {
      completedAt: '2019-11-01T21:40:46.415Z',
      createdAt: '2019-04-01T21:40:46.415Z',
      pk: 'section-outbox|docket',
      section: 'docket',
      sk: '2019-04-01T21:40:46.415Z',
    },
    {
      createdAt: '2019-03-01T21:40:46.415Z',
      documentId: '1079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      documentType: 'Order',
      draftState: {},
      eventCode: 'O',
      isDraft: true,
      isFileAttached: false,
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a4',
      sk: 'document|1079c990-cc6c-4b99-8fca-8e31f2d9e7a1',
      userId: '5579c990-cc6c-4b99-8fca-8e31f2d9e755',
    },
  ];

  beforeEach(() => {
    mockItems = [...items];
  });

  beforeAll(() => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: mockItems,
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {},
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('only modifies section-outbox and user-outbox records', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls.length).toEqual(2);
  });

  it('sets the record sk to its completedAt', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].sk).toEqual(items[0].completedAt);
    expect(putStub.mock.calls[1][0]['Item'].sk).toEqual(items[1].completedAt);
  });
});
