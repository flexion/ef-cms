const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { sendServedPartiesEmails } = require('./sendServedPartiesEmails');
jest.mock(
  '../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator',
  () => ({
    reactTemplateGenerator: jest.fn(),
  }),
);

describe('sendServedPartiesEmails', () => {
  beforeAll(() => {
    applicationContext.getIrsSuperuserEmail.mockReturnValue(
      'irsSuperuser@example.com',
    );
  });

  it('should call sendBulkTemplatedEmail if there are electronic service parties on the case and include the irs superuser if the case status is not new', async () => {
    await sendServedPartiesEmails({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        docketEntries: [
          { docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360', index: 1 },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        status: CASE_STATUS_TYPES.generalDocket,
      },
      docketEntryEntity: {
        docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
        documentType: 'The Document',
        index: 1,
        servedAt: '2019-03-01T21:40:46.415Z',
      },
      servedParties: {
        electronic: [
          { email: '1@example.com', name: '1' },
          { email: '2@example.com', name: '2' },
        ],
      },
    });

    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalled();
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[0][0].destinations,
    ).toMatchObject([
      { email: '1@example.com' },
      { email: '2@example.com' },
      { email: 'irsSuperuser@example.com' },
    ]);
  });

  it('should call sendBulkTemplatedEmail if there are electronic service parties on the case and not include the irs superuser if the case status is new', async () => {
    await sendServedPartiesEmails({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        docketEntries: [
          { docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360', index: 1 },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        status: CASE_STATUS_TYPES.new,
      },
      docketEntryEntity: {
        docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
        documentTitle: 'The Document',
        index: 1,
        servedAt: '2019-03-01T21:40:46.415Z',
      },
      servedParties: {
        electronic: [
          { email: '1@example.com', name: '1' },
          { email: '2@example.com', name: '2' },
        ],
      },
    });

    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalled();
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[0][0].destinations,
    ).toMatchObject([{ email: '1@example.com' }, { email: '2@example.com' }]);
  });

  it('should call sendBulkTemplatedEmail only for the irs superuser if there are no electronic service parties on the case and the case status is not new', async () => {
    await sendServedPartiesEmails({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        docketEntries: [
          { docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360', index: 1 },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        status: CASE_STATUS_TYPES.generalDocket,
      },
      docketEntryEntity: {
        docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
        documentTitle: 'The Document',
        index: 1,
        servedAt: '2019-03-01T21:40:46.415Z',
      },
      servedParties: {
        electronic: [],
      },
    });

    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalled();
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[0][0].destinations,
    ).toMatchObject([{ email: 'irsSuperuser@example.com' }]);
  });

  it('should concatenate the docketNumber and docketNumberSuffix if a docketNumberSuffix is present', async () => {
    await sendServedPartiesEmails({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        docketEntries: [
          { docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360', index: 1 },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        status: CASE_STATUS_TYPES.generalDocket,
      },
      docketEntryEntity: {
        docketEntryId: '0c745ceb-364a-4a1e-83b0-061f6f96a360',
        documentTitle: 'The Document',
        index: 1,
        servedAt: '2019-03-01T21:40:46.415Z',
      },
      servedParties: {
        electronic: [],
      },
    });

    const { caseDetail } = reactTemplateGenerator.mock.calls[0][0].data;
    expect(caseDetail.docketNumber).toEqual('123-20');
    expect(caseDetail.docketNumberWithSuffix).toEqual('123-20L');
  });
});
