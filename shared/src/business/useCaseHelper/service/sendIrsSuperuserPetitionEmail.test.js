const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  reactTemplateGenerator,
} = require('../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator');
const {
  sendIrsSuperuserPetitionEmail,
} = require('./sendIrsSuperuserPetitionEmail');
const { DOCKET_NUMBER_SUFFIXES } = require('../../entities/EntityConstants');
jest.mock(
  '../../utilities/generateHTMLTemplateForPDF/reactTemplateGenerator',
  () => ({
    reactTemplateGenerator: jest.fn(),
  }),
);

describe('sendIrsSuperuserPetitionEmail', () => {
  beforeAll(() => {
    applicationContext.getIrsSuperuserEmail.mockReturnValue('irs@example.com');
  });

  it('should call sendBulkTemplatedEmail for the IRS superuser party', async () => {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        contactPrimary: {},
        contactSecondary: {},
        docketEntries: [
          {
            docketEntryId: '35479520-e2d6-4357-b72f-5b46f16a708a',
            index: 0,
          },
        ],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        preferredTrialCity: 'Somecity, ST',
        privatePractitioners: [],
      },
      docketEntryEntity: {
        docketEntryId: '35479520-e2d6-4357-b72f-5b46f16a708a',
        documentType: 'The Document',
        eventCode: 'P',
        index: 0,
        servedAt: '2019-03-01T21:40:46.415Z',
      },
    });

    expect(reactTemplateGenerator).toHaveBeenCalled();
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail,
    ).toBeCalled();
    expect(
      applicationContext.getDispatchers().sendBulkTemplatedEmail.mock
        .calls[0][0].destinations,
    ).toMatchObject([{ email: 'irs@example.com' }]);
  });

  it('should concatenate the docketNumber and docketNumberSuffix if a docketNumberSuffix is present', async () => {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        contactSecondary: {
          name: 'Carol Baskin',
        },
        docketEntries: [],
        docketNumber: '123-20',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        docketNumberWithSuffix: '123-20S',
        preferredTrialCity: 'Somecity, ST',
        privatePractitioners: [
          {
            representingPrimary: true,
          },
          {
            representingSecondary: true,
          },
        ],
      },
      docketEntryEntity: {
        docketEntryId: 'test-document-id',
        documentType: 'The Document',
        eventCode: 'P',
        index: 1,
        servedAt: '2019-03-01T21:40:46.415Z',
      },
    });

    const { caseDetail } = reactTemplateGenerator.mock.calls[0][0].data;
    expect(caseDetail.docketNumber).toEqual('123-20');
    expect(caseDetail.docketNumberWithSuffix).toEqual('123-20S');
  });

  it('should add a `representing` field to practitioners with the names of parties they represent', async () => {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        contactSecondary: {
          name: 'Carol Baskin',
        },
        docketEntries: [],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        preferredTrialCity: 'Somecity, ST',
        privatePractitioners: [
          {
            representingPrimary: true,
          },
          {
            representingPrimary: true,
            representingSecondary: true,
          },
        ],
      },
      docketEntryEntity: {
        docketEntryId: 'test-document-id',
        documentType: 'The Document',
        eventCode: 'P',
        index: 1,
        servedAt: '2019-03-01T21:40:46.415Z',
      },
    });

    const { practitioners } = reactTemplateGenerator.mock.calls[0][0].data;

    expect(practitioners).toMatchObject([
      {
        representingFormatted: 'Joe Exotic',
        representingPrimary: true,
      },
      {
        representingFormatted: 'Joe Exotic, Carol Baskin',
        representingPrimary: true,
      },
    ]);
  });

  it('should include a formatted document filingDate', async () => {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        docketEntries: [],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        privatePractitioners: [],
      },
      docketEntryEntity: {
        filingDate: '2019-03-05T21:40:46.415Z',
        index: 1,
      },
    });

    const { documentDetail } = reactTemplateGenerator.mock.calls[0][0].data;

    expect(documentDetail).toMatchObject({
      filingDate: '03/05/19',
    });
  });

  it('should include the trial location from the case', async () => {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        docketEntries: [],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        preferredTrialCity: 'Fake Trial Location, ST',
        privatePractitioners: [],
      },
      docketEntryEntity: {
        filingDate: '2019-03-05T21:40:46.415Z',
        index: 1,
      },
    });

    const { caseDetail } = reactTemplateGenerator.mock.calls[0][0].data;

    expect(caseDetail).toMatchObject({
      trialLocation: 'Fake Trial Location, ST',
    });
  });

  it('should default the trial location if not set on the case', async () => {
    await sendIrsSuperuserPetitionEmail({
      applicationContext,
      caseEntity: {
        caseCaption: 'A Caption',
        contactPrimary: {
          name: 'Joe Exotic',
        },
        docketEntries: [],
        docketNumber: '123-20',
        docketNumberWithSuffix: '123-20L',
        preferredTrialCity: '',
        privatePractitioners: [],
      },
      docketEntryEntity: {
        filingDate: '2019-03-05T21:40:46.415Z',
        index: 1,
      },
    });

    const { caseDetail } = reactTemplateGenerator.mock.calls[0][0].data;

    expect(caseDetail).toMatchObject({
      trialLocation: 'No requested place of trial',
    });
  });

  it('should throw an error if the docket entry does not have an index', async () => {
    await expect(
      sendIrsSuperuserPetitionEmail({
        applicationContext,
        caseEntity: {
          caseCaption: 'A Caption',
          contactPrimary: {
            name: 'Joe Exotic',
          },
          docketEntries: [],
          docketNumber: '123-20',
          docketNumberWithSuffix: '123-20L',
          preferredTrialCity: '',
          privatePractitioners: [],
        },
        docketEntryEntity: {
          filingDate: '2019-03-05T21:40:46.415Z',
        },
      }),
    ).rejects.toThrow('Cannot serve a docket entry without an index.');
  });
});
