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
    TRANSCRIPT_EVENT_CODE,
  } = applicationContextPublic.getConstants();

  beforeEach(() => {
    state = {
      caseDetail: {
        docketNumber: '123-45',
        docketRecord: [],
        documents: [],
      },
    };
  });

  describe('formattedDocketEntries', () => {
    it('should return the formattedDocketEntries as an array', () => {
      const result = runCompute(publicCaseDetailHelper, { state });
      expect(Array.isArray(result.formattedDocketEntries)).toBeTruthy();
    });

    it('should return hasDocument false if the document is a minute entry', () => {
      state.caseDetail.documents = [
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
      expect(result.formattedDocketEntries[0]).toMatchObject({
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
    state.caseDetail.documents = [
      {
        action: 'something',
        createdAt: '2018-11-21T20:49:28.192Z',
        description: 'first record',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        documentTitle: 'Petition',
        documentType: 'Petition',
        eventCode: 'P',
        filingDate: '2018-11-21T20:49:28.192Z',
        index: 4,
        isOnDocketRecord: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
      },
      {
        createdAt: '2018-11-21T20:49:28.192Z',
        documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentTitle: 'Statement of Taxpayer Identification',
        documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
      },
      {
        additionalInfo: 'additionalInfo!',
        additionalInfo2: 'additional info 2!',
        attachments: true,
        createdAt: '2018-10-21T20:49:28.192Z',
        description: 'second record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405412',
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
        documentId: '8675309b-28d0-43ec-bafb-654e83405413',
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
        documentId: '8675309b-28d0-43ec-bafb-654e83405414',
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
        documentId: '8675309b-28d0-43ec-bafb-654e83405415',
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
        documentId: 'e47e365d-6349-4d23-98b4-421efb4d8007',
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
        documentId: 'e47e365d-6349-4d23-98b4-421efb4d8009',
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
    ];
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(result.formattedDocketEntries).toMatchObject([
      {
        createdAtFormatted: '10/21/18',
        description: 'second record additionalInfo!',
        descriptionDisplay: 'Answer',
        documentId: '8675309b-28d0-43ec-bafb-654e83405412',
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
        documentId: '8675309b-28d0-43ec-bafb-654e83405413',
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
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
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
        documentId: '8675309b-28d0-43ec-bafb-654e83405415',
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
        documentId: 'e47e365d-6349-4d23-98b4-421efb4d8007',
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
        documentId: 'e47e365d-6349-4d23-98b4-421efb4d8009',
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
        createdAtFormatted: undefined,
        description: 'fourth record',
        descriptionDisplay: 'Order to do something else',
        documentId: '8675309b-28d0-43ec-bafb-654e83405414',
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
