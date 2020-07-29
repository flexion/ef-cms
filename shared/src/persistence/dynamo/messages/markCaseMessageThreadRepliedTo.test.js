const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  markCaseMessageThreadRepliedTo,
} = require('./markCaseMessageThreadRepliedTo');

describe('markCaseMessageThreadRepliedTo', () => {
  const DOCKET_NUMBER = '123-20';

  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
    applicationContext.getDocumentClient().update.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
    applicationContext.getDocumentClient().query.mockReturnValueOnce({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              docketNumber: DOCKET_NUMBER,
              gsi1pk: 'message|28de1ba1-8518-4a7d-8075-4291eea569c7',
              messageId: '28de1ba1-8518-4a7d-8075-4291eea569c7',
              pk: `case|${DOCKET_NUMBER}`,
              sk: 'message|28de1ba1-8518-4a7d-8075-4291eea569c7',
            },
            {
              docketNumber: DOCKET_NUMBER,
              gsi1pk: 'message|28de1ba1-8518-4a7d-8075-4291eea569c7',
              messageId: 'badc2bf0-cc82-4fd1-9a61-d1a8937a4f1b',
              pk: `case|${DOCKET_NUMBER}`,
              sk: 'message|badc2bf0-cc82-4fd1-9a61-d1a8937a4f1b',
            },
          ],
        }),
    });
  });

  it('attempts to update the case message records', async () => {
    await markCaseMessageThreadRepliedTo({
      applicationContext,
      parentMessageId: '0c0de040-1dfd-4be8-937a-d6aefdfcd71d',
    });

    expect(
      applicationContext.getDocumentClient().update.mock.calls.length,
    ).toEqual(2);
    expect(
      applicationContext.getDocumentClient().update.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: `case|${DOCKET_NUMBER}`,
        sk: 'message|28de1ba1-8518-4a7d-8075-4291eea569c7',
      },
    });
    expect(
      applicationContext.getDocumentClient().update.mock.calls[1][0],
    ).toMatchObject({
      Key: {
        pk: `case|${DOCKET_NUMBER}`,
        sk: 'message|badc2bf0-cc82-4fd1-9a61-d1a8937a4f1b',
      },
    });
  });
});
