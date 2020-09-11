const { forAllRecords } = require('./utilities');
const { up } = require('./00036-description-document-title');

describe('Docket Entry: renames description to documentTitle if documentTitle does not exist', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let records;

  const DOCUMENT_ID_1 = '56ab686e-bf8f-4de9-a405-5f7ce8f9ca98';
  const DOCUMENT_ID_2 = '56ab686e-bf8f-4de9-a405-5f7ce8f9ca99';

  beforeAll(() => {
    records = [
      {
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
      },
      {
        description: 'Guy Fieri has an Answer',
        documentId: DOCUMENT_ID_1,
        documentTitle: 'Guy Fieri has an Answer',
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: `docket-entry|${DOCUMENT_ID_1}`,
      },
      {
        description: 'Guy Fieri has another Answer',
        documentId: DOCUMENT_ID_2,
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: `docket-entry|${DOCUMENT_ID_2}`,
      },
    ];

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: records,
      }),
    });
    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    documentClient = {
      put: putStub,
      scan: scanStub,
    };
  });

  it('mutates only docket entry records with no documentTitle', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).toHaveBeenCalledTimes(1);
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        documentId: DOCUMENT_ID_2,
        documentTitle: 'Guy Fieri has another Answer',
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: `docket-entry|${DOCUMENT_ID_2}`,
      },
    });
  });
});
