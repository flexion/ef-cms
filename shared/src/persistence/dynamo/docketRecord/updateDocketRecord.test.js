const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateDocketRecord } = require('./updateDocketRecord');

const mockDocketRecordId = '9b52c605-edba-41d7-b045-d5f992a499d3';
const mockCaseId = '9b52c506-edba-41d7-b045-d5f992a499d3';

const mockDocketRecord = {
  docketRecordId: mockDocketRecordId,
  documentTitle: 'Title of le Document',
  filedBy: 'The one and only, Guy Fieri',
  status: 'complete',
};

describe('updateDocketRecord', () => {
  it('makes put request with the given docket record data for the matching docket record id', async () => {
    await updateDocketRecord({
      applicationContext,
      caseId: mockCaseId,
      docketRecord: mockDocketRecord,
      docketRecordId: mockDocketRecordId,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: `case|${mockCaseId}`,
        sk: `docket-record|${mockDocketRecordId}`,
        ...mockDocketRecord,
      },
    });
  });
});
