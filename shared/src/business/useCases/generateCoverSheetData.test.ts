import {
  DOCKET_NUMBER_SUFFIXES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  MULTI_DOCKET_EXTERNAL_FILING_EVENT_CODES,
  PARTY_TYPES,
} from '../entities/EntityConstants';
import { FORMATS, formatDateString } from '../utilities/DateHandler';
import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { generateCoverSheetData } from './generateCoverSheetData';

describe('generateCoverSheetData', () => {
  const testingCaseData = {
    ...MOCK_CASE,
    docketEntries: [
      {
        ...MOCK_CASE.docketEntries[0],
        certificateOfService: false,
        createdAt: '2019-04-19T14:45:15.595Z',
        documentType: 'Answer',
        eventCode: 'A',
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.pending,
      },
    ],
  };

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValue({
        isFeatureFlagEnabled: true,
      });
  });

  it('should append Certificate of Service to the coversheet when the document is filed with a Certificate of Service', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        certificateOfService: true,
      },
    } as any);

    expect(result.certificateOfService).toEqual(true);
  });

  it('should NOT append Certificate of Service to the coversheet when the document is filed without a Certificate of Service', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        certificateOfService: false,
      },
    } as any);

    expect(result.certificateOfService).toEqual(false);
  });

  it('should append the filing date to the coversheet formatted as "MM/DD/YY"', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: '2019-04-19T14:45:15.595Z',
      },
    } as any);

    expect(result.dateFiledLodged).toEqual('04/19/19');
  });

  it('should NOT append the filing date to the coversheet when it is not valid', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: null,
      },
    } as any);

    expect(result.dateFiledLodged).toEqual('');
  });

  it('should append additionalInfo to the coversheet when addToCoversheet is true', async () => {
    const expectedAdditionalInfo = 'abc';

    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        addToCoversheet: true,
        additionalInfo: expectedAdditionalInfo,
        filingDate: '2019-04-19T14:45:15.595Z',
      },
    } as any);

    expect(result.documentTitle).toEqual(`Petition ${expectedAdditionalInfo}`);
  });

  it('should append a filing date label of Filed when the document is NOT lodged', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        lodged: false,
      },
    } as any);

    expect(result.dateFiledLodgedLabel).toEqual('Filed');
  });

  it('should append a filing date label of Lodged when the document is lodged', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        lodged: true,
      },
    } as any);

    expect(result.dateFiledLodgedLabel).toEqual('Lodged');
  });

  it('should append the received date WITH time when the document is electronically filed', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: false,
      },
      filingDateUpdated: false,
    } as any);

    expect(result.dateReceived).toEqual('04/19/19 10:45 am');
  });

  it('should append the received date as an empty string when the document does not have a valid createdAt and is electronically filed', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        createdAt: null,
        isPaper: false,
      },
      filingDateUpdated: false,
    } as any);

    expect(result.dateReceived).toEqual('');
  });

  it('should append the received date WITHOUT time when the document is paper filed', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: '2019-04-19T14:45:15.595Z',
        isPaper: true,
      },
    } as any);

    expect(result.dateReceived).toEqual('04/19/19');
  });

  it('shows does not show the received date if the document does not have a valid createdAt and is filed by paper', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        createdAt: null,
        isPaper: true,
      },
    } as any);

    expect(result.dateReceived).toEqual('');
  });

  it('displays the date served if present in MMDDYYYY format', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        servedAt: '2019-04-20T14:45:15.595Z',
      },
    } as any);

    expect(result.dateServed).toEqual('04/20/19');
  });

  it('does not display the service date if servedAt is not present', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        servedAt: undefined,
      },
    } as any);

    expect(result.dateServed).toEqual('');
  });

  it('returns the docket number along with a Docket Number label', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
    } as any);

    expect(result.docketNumberWithSuffix).toEqual(MOCK_CASE.docketNumber);
  });

  it('returns the docket number with suffix along with a Docket Number label', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        caseCaption: 'Janie Petitioner, Petitioner',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      },
      docketEntryEntity: testingCaseData.docketEntries[0],
    } as any);

    expect(result.docketNumberWithSuffix).toEqual(
      `${MOCK_CASE.docketNumber}${DOCKET_NUMBER_SUFFIXES.SMALL}`,
    );
  });

  it('displays Electronically Filed when the document is filed electronically', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        isPaper: false,
      },
    } as any);

    expect(result.electronicallyFiled).toEqual(true);
  });

  it('does NOT display Electronically Filed when the document is filed by paper', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        isPaper: true,
      },
    } as any);

    expect(result.electronicallyFiled).toEqual(false);
  });

  it('returns the mailing date if present', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        mailingDate: '04/16/2019',
      },
    } as any);

    expect(result.mailingDate).toEqual('04/16/2019');
  });

  it('returns the index of the docket entry as part of the coversheet data', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        mailingDate: '04/16/2019',
      },
    } as any);

    expect(result.index).toEqual(testingCaseData.docketEntries[0].index);
  });

  it('returns an empty string for the mailing date if NOT present', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        mailingDate: undefined,
      },
    } as any);

    expect(result.mailingDate).toEqual('');
  });

  it('generates cover sheet data appropriate for multiple petitioners', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        caseCaption: 'Janie Petitioner & Janie Petitioner, Petitioners',
      },
      docketEntryEntity: testingCaseData.docketEntries[0],
    } as any);

    expect(result.caseCaptionExtension).toEqual('Petitioners');
  });

  it('generates cover sheet data appropriate for a single petitioner', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
    } as any);

    expect(result.caseCaptionExtension).toEqual(PARTY_TYPES.petitioner);
  });

  it('generates empty string for caseCaptionExtension if the caseCaption is not in the proper format', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        caseCaption: 'Janie Petitioner',
      },
      docketEntryEntity: testingCaseData.docketEntries[0],
    } as any);

    expect(result.caseCaptionExtension).toEqual('');
  });

  it('preserves the original case caption and docket number when the useInitialData is true', async () => {
    const mockInitialDocketNumberSuffix = 'Z';

    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        caseCaption: 'Janie Petitioner, Petitioner',
        docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
        initialCaption: 'Janie and Jackie Petitioner, Petitioners',
        initialDocketNumberSuffix: mockInitialDocketNumberSuffix,
      },
      docketEntryEntity: testingCaseData.docketEntries[0],
      useInitialData: true,
    } as any);

    expect(result.docketNumberWithSuffix).toEqual(
      `${MOCK_CASE.docketNumber}${mockInitialDocketNumberSuffix}`,
    );
    expect(result.caseTitle).toEqual('Janie and Jackie Petitioner, ');
  });

  it('does NOT display dateReceived, electronicallyFiled, and dateServed when the coversheet is being generated for a court issued document', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        documentType: 'U.S.C.A',
        eventCode: 'USCA',
        lodged: true,
        servedAt: '2019-04-20T14:45:15.595Z',
      },
    } as any);

    expect(result.dateReceived).toBeUndefined();
    expect(result.electronicallyFiled).toBeUndefined();
    expect(result.dateServed).toBeUndefined();
  });

  it('sets the dateReceived to dateFiledFormatted when the filingDate has been updated', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        filingDate: '2019-05-19T14:45:15.595Z',
      },
      filingDateUpdated: true,
    } as any);

    expect(result.dateReceived).toBe('05/19/19');
  });

  it('sets the dateReceived to createdAt date when the filingDate has not been updated', async () => {
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        createdAt: '2019-02-15T14:45:15.595Z',
        filingDate: '2019-05-19T14:45:15.595Z',
        isPaper: true,
      },
      filingDateUpdated: false,
    } as any);

    expect(result.dateReceived).toBe('02/15/19');
  });

  it('should use documentType as documentTitle if documentTitle is undefined', async () => {
    const mockDocumentType = 'test doc type';

    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        documentTitle: undefined,
        documentType: mockDocumentType,
      },
      filingDateUpdated: false,
    } as any);

    expect(result.documentTitle).toBe(mockDocumentType);
  });

  it('should formatDateString if stampData.date exists', async () => {
    const mockDate = applicationContext.getUtilities().createISODateString();
    const result = await generateCoverSheetData({
      applicationContext,
      caseEntity: testingCaseData,
      docketEntryEntity: testingCaseData.docketEntries[0],
      stampData: {
        date: mockDate,
      },
    } as any);

    expect(result.stamp.date).toEqual(
      formatDateString(mockDate, FORMATS.MMDDYYYY),
    );
  });

  it('should append consolidated group information to the coversheet when the document filed is multi-docketable', async () => {
    await generateCoverSheetData({
      applicationContext,
      caseEntity: {
        ...testingCaseData,
        leadDocketNumber: testingCaseData.docketNumber,
      },
      docketEntryEntity: {
        ...testingCaseData.docketEntries[0],
        eventCode: MULTI_DOCKET_EXTERNAL_FILING_EVENT_CODES[0],
      },
    } as any);

    expect(
      applicationContext.getUseCaseHelpers()
        .formatConsolidatedCaseCoversheetData,
    ).toHaveBeenCalled();
  });
});
