const {
  migrateItems,
} = require('./0001-default-court-issued-filing-date-to-served-at');
const {
  MOCK_DOCUMENTS,
} = require('../../../../../shared/src/test/mockDocuments');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let documentClient;

  beforeEach(() => {});

  it('should set the filingDate to match the servedAt timestamp when the item is a court issued document that has been served', async () => {
    const mockServedAt = '2020-07-17T19:28:29.675Z';

    const items = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
        ...MOCK_DOCUMENTS[0],
        eventCode: 'O',
        filingDate: undefined,
        servedAt: mockServedAt,
        servedParties: [],
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].servedAt).toEqual(results[0].filingDate);
  });

  it('should NOT modify any other properties on a served, court-issued docket entry other than filingDate', async () => {
    const mockServedAt = '2020-07-17T19:28:29.675Z';
    const mockDocketEntry = {
      ...MOCK_DOCUMENTS[0],
      eventCode: 'O',
      filedBy: 'Bernard Lowe, Petitioner',
      filingDate: undefined,
      servedAt: mockServedAt,
      servedParties: [
        {
          name: 'Bernard Lowe',
        },
        {
          name: 'IRS',
          role: 'irsSuperuser',
        },
      ],
    };

    const items = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
        ...mockDocketEntry,
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toEqual({
      ...mockDocketEntry,
      filingDate: mockServedAt,
    });
  });
});
