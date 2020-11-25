import { applicationContextPublic } from '../../../applicationContextPublic';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from './publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('publicCaseDetailHelper', () => {
  let state;

  const publicCaseDetailHelper = withAppContextDecorator(
    publicCaseDetailHelperComputed,
    applicationContextPublic,
  );
  const {
    DOCUMENT_PROCESSING_STATUS_OPTIONS,
    INITIAL_DOCUMENT_TYPES,
    STIPULATED_DECISION_EVENT_CODE,
    TRANSCRIPT_EVENT_CODE,
  } = applicationContextPublic.getConstants();

  beforeEach(() => {
    state = {
      caseDetail: {
        docketEntries: [],
        docketNumber: '123-45',
      },
    };
  });

  describe('formattedDocketEntriesOnDocketRecord', () => {
    it('should return the formattedDocketEntriesOnDocketRecord as an array', () => {
      const result = runCompute(publicCaseDetailHelper, { state });
      expect(
        Array.isArray(result.formattedDocketEntriesOnDocketRecord),
      ).toBeTruthy();
    });

    it('should return hasDocument false if the document is a minute entry', () => {
      state.caseDetail.docketEntries = [
        {
          description: 'Request for Place of Trial at Flavortown, TN',
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
        },
      ];
      state.caseDetail.docketEntries = [
        {
          description: 'Request for Place of Trial at Flavortown, TN',
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
        },
      ];

      const result = runCompute(publicCaseDetailHelper, { state });
      expect(result.formattedDocketEntriesOnDocketRecord[0]).toMatchObject({
        description: 'Request for Place of Trial at Flavortown, TN',
        hasDocument: false,
      });
    });
  });

  it('should indicate when a case is sealed', () => {
    state.caseDetail.isSealed = true;
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(result.formattedCaseDetail.isCaseSealed).toBeTruthy();
  });

  it('should format docket entries with documents and sort chronologically', () => {
    state.caseDetail.docketEntries = [
      {
        action: 'something',
        createdAt: '2018-11-21T20:49:28.192Z',
        description: 'first record',
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        documentTitle: 'Petition',
        documentType: 'Petition',
        eventCode: 'P',
        filingDate: '2018-11-21T20:49:28.192Z',
        index: 4,
        isOnDocketRecord: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
      },
      {
        additionalInfo: 'additionalInfo!',
        additionalInfo2: 'additional info 2!',
        attachments: true,
        createdAt: '2018-10-21T20:49:28.192Z',
        description: 'second record',
        docketEntryId: '8675309b-28d0-43ec-bafb-654e83405412',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Petrs. Dylan Fowler & Jaquelyn Estes',
        filingDate: '2018-10-21T20:49:28.192Z',
        index: 1,
        isOnDocketRecord: true,
        numberOfPages: 0,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
      },
      {
        createdAt: '2018-10-25T20:49:28.192Z',
        description: 'third record',
        docketEntryId: '8675309b-28d0-43ec-bafb-654e83405413',
        documentTitle: 'Order to do something',
        documentType: 'Order',
        eventCode: 'O',
        filingDate: '2018-10-25T20:49:28.192Z',
        index: 3,
        isOnDocketRecord: true,
        numberOfPages: 0,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        servedAt: '2018-11-27T20:49:28.192Z',
        status: 'served',
      },
      {
        createdAt: '2018-10-25T20:49:28.192Z',
        description: 'fourth record',
        docketEntryId: '8675309b-28d0-43ec-bafb-654e83405414',
        documentTitle: 'Order to do something else',
        documentType: 'Order',
        eventCode: 'O',
        filingDate: '2018-10-25T20:49:28.192Z',
        index: 2,
        isOnDocketRecord: true,
        numberOfPages: 0,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        signatory: 'abc',
      },
      {
        createdAt: '2018-12-25T20:49:28.192Z',
        description: 'fifth record',
        docketEntryId: '8675309b-28d0-43ec-bafb-654e83405415',
        documentType: 'Request for Place of Trial',
        eventCode: 'RQT',
        filingDate: '2018-12-25T20:49:28.192Z',
        index: 5,
        isOnDocketRecord: true,
        numberOfPages: 0,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      },
      {
        createdAt: '2018-12-25T20:49:28.192Z',
        description: 'sixth record',
        docketEntryId: 'e47e365d-6349-4d23-98b4-421efb4d8007',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        filingDate: '2018-12-25T20:49:28.192Z',
        index: 6,
        isOnDocketRecord: true,
        numberOfPages: 0,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        servedAt: '2018-11-27T20:49:28.192Z',
      },
      {
        createdAt: '2019-12-24T20:49:28.192Z',
        description: 'seventh record',
        docketEntryId: 'e47e365d-6349-4d23-98b4-421efb4d8009',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        filingDate: '2019-12-24T20:49:28.192Z',
        index: 7,
        isOnDocketRecord: true,
        isStricken: true,
        numberOfPages: 0,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        servedAt: '2019-12-24T21:49:28.192Z',
      },
      {
        createdAt: '2019-12-24T20:49:28.192Z',
        description: 'eighth record',
        docketEntryId: 'd1eb1db6-25fd-4683-931b-a2f4bc366788',
        documentType: 'Stipulated Decision',
        eventCode: STIPULATED_DECISION_EVENT_CODE,
        filingDate: '2019-12-24T20:49:28.192Z',
        index: 8,
        isOnDocketRecord: true,
        isStricken: false,
        numberOfPages: 0,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        servedAt: '2019-12-24T21:49:28.192Z',
      },
      {
        createdAt: '2019-12-25T20:49:28.192Z',
        description: 'ninth record',
        docketEntryId: '5d742def-7011-4f90-ab2c-5f00c052f7fa',
        documentTitle: 'Record on Appeal',
        documentType: 'Record on Appeal',
        eventCode: 'ROA',
        filingDate: '2019-12-25T20:49:28.192Z',
        index: 9,
        isOnDocketRecord: true,
        isStricken: false,
        numberOfPages: 0,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      },
    ];
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(result.formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        createdAtFormatted: '10/21/18',
        descriptionDisplay: 'Answer',
        docketEntryId: '8675309b-28d0-43ec-bafb-654e83405412',
        eventCode: 'A',
        filedBy: 'Petrs. Dylan Fowler & Jaquelyn Estes',
        filingsAndProceedingsWithAdditionalInfo:
          ' additionalInfo! (Attachment(s)) additional info 2!',
        hasDocument: true,
        index: 1,
        isPaper: undefined,
        servedAtFormatted: undefined,
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: true,
        showServed: false,
        signatory: undefined,
      },
      {
        createdAtFormatted: '10/25/18',
        description: 'third record',
        descriptionDisplay: 'Order to do something',
        docketEntryId: '8675309b-28d0-43ec-bafb-654e83405413',
        eventCode: 'O',
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 3,
        isPaper: undefined,
        servedAtFormatted: '11/27/18',
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: false,
        showLinkToDocument: true,
        showNotServed: false,
        showServed: true,
        signatory: undefined,
      },
      {
        action: 'something',
        createdAtFormatted: '11/21/18',
        description: 'first record',
        descriptionDisplay: 'Petition',
        docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
        eventCode: 'P',
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 4,
        isPaper: undefined,
        servedAtFormatted: undefined,
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: true,
        showServed: false,
        signatory: undefined,
      },
      {
        action: undefined,
        createdAtFormatted: '12/25/18',
        description: 'fifth record',
        descriptionDisplay: 'fifth record',
        docketEntryId: '8675309b-28d0-43ec-bafb-654e83405415',
        eventCode: 'RQT',
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 5,
        isPaper: undefined,
        servedAtFormatted: undefined,
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: true,
        showServed: false,
        signatory: undefined,
      },
      {
        action: undefined,
        createdAtFormatted: '12/25/18',
        description: 'sixth record',
        descriptionDisplay: 'sixth record',
        docketEntryId: 'e47e365d-6349-4d23-98b4-421efb4d8007',
        eventCode: TRANSCRIPT_EVENT_CODE,
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 6,
        isPaper: undefined,
        servedAtFormatted: '11/27/18',
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: false,
        showServed: true,
        signatory: undefined,
      },
      {
        createdAtFormatted: '12/24/19',
        description: 'seventh record',
        descriptionDisplay: 'seventh record',
        docketEntryId: 'e47e365d-6349-4d23-98b4-421efb4d8009',
        eventCode: TRANSCRIPT_EVENT_CODE,
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 7,
        isPaper: undefined,
        servedAtFormatted: '12/24/19',
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: false,
        showServed: true,
        signatory: undefined,
      },
      {
        createdAtFormatted: '12/24/19',
        description: 'eighth record',
        descriptionDisplay: 'eighth record',
        docketEntryId: 'd1eb1db6-25fd-4683-931b-a2f4bc366788',
        eventCode: STIPULATED_DECISION_EVENT_CODE,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 8,
        isStricken: false,
        servedAtFormatted: '12/24/19',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: false,
        showServed: true,
      },
      {
        createdAtFormatted: '12/25/19',
        description: 'ninth record',
        descriptionDisplay: 'Record on Appeal',
        docketEntryId: '5d742def-7011-4f90-ab2c-5f00c052f7fa',
        eventCode: 'ROA',
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 9,
        showDocumentDescriptionWithoutLink: false,
        showLinkToDocument: true,
        showNotServed: false,
        showServed: false,
      },
      {
        createdAtFormatted: undefined,
        description: 'fourth record',
        descriptionDisplay: 'Order to do something else',
        docketEntryId: '8675309b-28d0-43ec-bafb-654e83405414',
        eventCode: 'O',
        filedBy: undefined,
        filingsAndProceedingsWithAdditionalInfo: '',
        hasDocument: true,
        index: 2,
        isPaper: undefined,
        servedAtFormatted: undefined,
        servedPartiesCode: '',
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showNotServed: true,
        showServed: false,
        signatory: 'abc',
      },
    ]);
  });
});
