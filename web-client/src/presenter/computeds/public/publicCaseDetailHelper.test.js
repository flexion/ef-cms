import { applicationContextPublic } from '../../../applicationContextPublic';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from './publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

const publicCaseDetailHelper = withAppContextDecorator(
  publicCaseDetailHelperComputed,
  applicationContextPublic,
);

let state;
describe('publicCaseDetailHelper', () => {
  beforeEach(() => {
    state = {
      caseDetail: {
        docketNumber: '123-45',
        docketRecord: [],
      },
    };
  });

  it('should return the formattedDocketEntries as an array', () => {
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(Array.isArray(result.formattedDocketEntries)).toBeTruthy();
  });

  it('should indicate when a case is sealed', () => {
    state.caseDetail.isSealed = true;
    const result = runCompute(publicCaseDetailHelper, { state });
    expect(result.formattedCaseDetail.isCaseSealed).toBeTruthy();
  });

  it('should format docket entries with documents and sort chronologically', () => {
    state.caseDetail.docketRecord = [
      {
        action: 'something',
        createdAt: '2018-11-21T20:49:28.192Z',
        description: 'first record',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        index: 4,
      },
      {
        createdAt: '2018-10-21T20:49:28.192Z',
        description: 'second record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405412',
        index: 1,
      },
      {
        createdAt: '2018-10-25T20:49:28.192Z',
        description: 'third record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405413',
        index: 3,
      },
      {
        createdAt: '2018-10-25T20:49:28.192Z',
        description: 'fourth record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405414',
        index: 2,
        signatory: 'abc',
      },
      {
        createdAt: '2018-12-25T20:49:28.192Z',
        description: 'fifth record',
        documentId: '8675309b-28d0-43ec-bafb-654e83405415',
        index: 5,
      },
    ];
    state.caseDetail.documents = [
      {
        createdAt: '2018-11-21T20:49:28.192Z',
        documentId: '8675309b-18d0-43ec-bafb-654e83405411',
        documentTitle: 'Petition',
        documentType: 'Petition',
        eventCode: 'P',
        filingDate: '2018-11-21T20:49:28.192Z',
        processingStatus: 'pending',
      },
      {
        createdAt: '2018-11-21T20:49:28.192Z',
        documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentTitle: 'Statement of Taxpayer Identification',
        documentType: 'Statement of Taxpayer Identification',
        filingDate: '2018-11-21T20:49:28.192Z',
        processingStatus: 'pending',
      },
      {
        additionalInfo: 'additionalInfo!',
        additionalInfo2: 'additional info 2!',
        attachments: true,
        createdAt: '2018-10-21T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405412',
        documentTitle: 'Answer',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Petrs. Dylan Fowler & Jaquelyn Estes',
        filingDate: '2018-10-21T20:49:28.192Z',
        processingStatus: 'pending',
      },
      {
        createdAt: '2018-10-25T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405413',
        documentTitle: 'Order to do something',
        documentType: 'O - Order',
        eventCode: 'O',
        filingDate: '2018-10-25T20:49:28.192Z',
        processingStatus: 'complete',
        servedAt: '2018-11-27T20:49:28.192Z',
        status: 'served',
      },
      {
        createdAt: '2018-10-25T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405414',
        documentTitle: 'Order to do something else',
        documentType: 'O - Order',
        eventCode: 'O',
        filingDate: '2018-10-25T20:49:28.192Z',
        processingStatus: 'pending',
      },
      {
        createdAt: '2018-12-25T20:49:28.192Z',
        documentId: '8675309b-28d0-43ec-bafb-654e83405415',
        documentType: 'Request for Place of Trial',
        eventCode: 'RQT',
        filingDate: '2018-12-25T20:49:28.192Z',
        processingStatus: 'complete',
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
        showNotServed: false,
        showServed: false,
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
        showNotServed: false,
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
        showNotServed: false,
        showServed: false,
        signatory: undefined,
      },
    ]);
  });
});
