import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedPendingItems as formattedPendingItemsComputed } from './formattedPendingItems';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedPendingItems = withAppContextDecorator(
  formattedPendingItemsComputed,
);

const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = applicationContext.getConstants();
const mockPendingItems = [
  {
    associatedJudge: 'Chief Judge',
    caseCaption: 'Brett Osborne, Petitioner',
    caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
    caseStatus: 'New',
    category: 'Miscellaneous',
    certificateOfServiceDate: null,
    createdAt: '2019-01-10',
    docketNumber: '101-19',
    docketNumberSuffix: 'W',
    documentId: '33ddbf4f-90f8-417c-8967-57851b0b9069',
    documentType: 'Administrative Record',
    eventCode: 'ADMR',
    filedBy: 'Petr. Brett Osborne',
    isFileAttached: true,
    isPaper: true,
    lodged: false,
    partyPrimary: true,
    pending: true,
    privatePractitioners: [],
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    receivedAt: '2019-01-10',
    relationship: 'primaryDocument',
    scenario: 'Standard',
    userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    workItems: [
      {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Docketclerk',
        caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
        caseStatus: 'New',
        completedAt: '2019-11-13T00:38:59.049Z',
        completedBy: 'Test Docketclerk',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        completedMessage: 'completed',
        createdAt: '2019-11-13T00:38:59.048Z',
        docketNumber: '101-19',
        docketNumberSuffix: 'W',
        document: {
          caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
          category: 'Miscellaneous',
          certificateOfServiceDate: null,
          createdAt: '2019-01-10',
          docketNumber: '101-19',
          documentId: '33ddbf4f-90f8-417c-8967-57851b0b9069',
          documentTitle: 'Administrative Record',
          documentType: 'Administrative Record',
          eventCode: 'ADMR',
          filedBy: 'Petr. Brett Osborne',
          isFileAttached: true,
          isPaper: true,
          lodged: false,
          partyPrimary: true,
          pending: true,
          privatePractitioners: [],
          processingStatus: 'pending',
          receivedAt: '2019-01-10',
          relationship: 'primaryDocument',
          scenario: 'Standard',
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        },
        isQC: true,
        isRead: true,
        messages: [
          {
            createdAt: '2019-11-13T00:38:59.049Z',
            from: 'Test Docketclerk',
            fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Administrative Record filed by Docketclerk is ready for review.',
            messageId: '5de1edbf-98f9-4099-a9a0-68905091327f',
          },
        ],
        section: 'docket',
        sentBy: 'Test Docketclerk',
        sentBySection: 'docket',
        sentByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        updatedAt: '2019-11-13T00:38:59.048Z',
        workItemId: '1cfba306-a570-4347-833d-1956923dc78f',
      },
    ],
  },
  {
    associatedJudge: 'Chief Judge',
    caseCaption: 'Brett Osborne, Petitioner',
    caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
    caseStatus: 'New',
    category: 'Supporting Document',
    certificateOfServiceDate: null,
    createdAt: '2018-01-20',
    docketNumber: '101-19',
    docketNumberSuffix: 'W',
    documentId: 'dd956ab1-5cde-4e78-bae0-ac7faee40426',
    documentTitle: 'Affidavit of Bob in Support of Petition',
    documentType: 'Affidavit in Support',
    eventCode: 'AFF',
    filedBy: 'Resp.',
    freeText: 'Bob',
    isFileAttached: true,
    isPaper: true,
    lodged: false,
    partyIrsPractitioner: true,
    pending: true,
    previousDocument: 'Petition',
    privatePractitioners: [],
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    receivedAt: '2018-01-20',
    relationship: 'primaryDocument',
    scenario: 'Nonstandard C',
    userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    workItems: [
      {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Docketclerk',
        caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
        caseStatus: 'New',
        completedAt: '2019-11-13T02:27:07.801Z',
        completedBy: 'Test Docketclerk',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        completedMessage: 'completed',
        createdAt: '2019-11-13T02:26:51.448Z',
        docketNumber: '101-19',
        docketNumberSuffix: 'W',
        document: {
          caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
          category: 'Supporting Document',
          certificateOfServiceDate: null,
          createdAt: '2019-01-20',
          docketNumber: '101-19',
          documentId: 'dd956ab1-5cde-4e78-bae0-ac7faee40426',
          documentTitle: 'Affidavit of Bob in Support of Petition',
          documentType: 'Affidavit in Support',
          eventCode: 'AFF',
          filedBy: 'Resp.',
          freeText: 'Bob',
          isFileAttached: true,
          isPaper: true,
          lodged: false,
          partyIrsPractitioner: true,
          pending: true,
          previousDocument: 'Petition',
          privatePractitioners: [],
          processingStatus: 'pending',
          receivedAt: '2019-01-20',
          relationship: 'primaryDocument',
          scenario: 'Nonstandard C',
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        },
        isQC: true,
        isRead: true,
        messages: [
          {
            createdAt: '2019-11-13T02:26:51.449Z',
            from: 'Test Docketclerk',
            fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Affidavit in Support filed by Docketclerk is ready for review.',
            messageId: '7fa6cac2-53b3-4cf1-9834-d3c0a0dfa89e',
          },
        ],
        section: 'docket',
        sentBy: 'Test Docketclerk',
        sentBySection: 'docket',
        sentByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        updatedAt: '2019-11-13T02:26:51.448Z',
        workItemId: '1487b2a4-6c75-44b6-92fb-038b4c810669',
      },
    ],
  },
  {
    associatedJudge: 'Judge A',
    caseCaption: 'Brett Osborne, Petitioner',
    caseId: '421872dc-e87d-4214-8ad0-c861d9b76c88',
    caseStatus: 'New',
    category: 'Supporting Document',
    certificateOfServiceDate: null,
    createdAt: '2018-01-20',
    docketNumber: '103-19',
    docketNumberSuffix: 'W',
    documentId: 'dd956ab1-5cde-4e78-bae0-ac7faee40426',
    documentTitle: 'Affidavit of Bob in Support of Petition',
    documentType: 'Affidavit in Support',
    eventCode: 'AFF',
    filedBy: 'Resp.',
    freeText: 'Bob',
    isFileAttached: true,
    isPaper: true,
    lodged: false,
    partyIrsPractitioner: true,
    pending: true,
    previousDocument: 'Petition',
    privatePractitioners: [],
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    receivedAt: '2018-01-20',
    relationship: 'primaryDocument',
    scenario: 'Nonstandard C',
    userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    workItems: [
      {
        assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Docketclerk',
        caseId: '421872dc-e87d-4214-8ad0-c861d9b76c88',
        caseStatus: 'New',
        completedAt: '2019-11-13T02:27:07.801Z',
        completedBy: 'Test Docketclerk',
        completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        completedMessage: 'completed',
        createdAt: '2019-11-13T02:26:51.448Z',
        docketNumber: '101-19',
        docketNumberSuffix: 'W',
        document: {
          caseId: '421872dc-e87d-4214-8ad0-c861d9b76c88',
          category: 'Supporting Document',
          certificateOfServiceDate: null,
          createdAt: '2019-01-20',
          docketNumber: '101-19',
          documentId: 'dd956ab1-5cde-4e78-bae0-ac7faee40426',
          documentTitle: 'Affidavit of Bob in Support of Petition',
          documentType: 'Affidavit in Support',
          eventCode: 'AFF',
          filedBy: 'Resp.',
          freeText: 'Bob',
          isFileAttached: true,
          isPaper: true,
          lodged: false,
          partyIrsPractitioner: true,
          pending: true,
          previousDocument: 'Petition',
          privatePractitioners: [],
          processingStatus: 'pending',
          receivedAt: '2019-01-20',
          relationship: 'primaryDocument',
          scenario: 'Nonstandard C',
          userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        },
        isQC: true,
        isRead: true,
        messages: [
          {
            createdAt: '2019-11-13T02:26:51.449Z',
            from: 'Test Docketclerk',
            fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
            message:
              'Affidavit in Support filed by Docketclerk is ready for review.',
            messageId: '7fa6cac2-53b3-4cf1-9834-d3c0a0dfa89e',
          },
        ],
        section: 'docket',
        sentBy: 'Test Docketclerk',
        sentBySection: 'docket',
        sentByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
        updatedAt: '2019-11-13T02:26:51.448Z',
        workItemId: '1487b2a4-6c75-44b6-92fb-038b4c810669',
      },
    ],
  },
];

describe('formattedPendingItems', () => {
  it('returns the cases and judges', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        pendingItems: mockPendingItems,
      },
    });
    expect(result).toMatchObject({
      items: [
        {
          associatedJudge: 'Chief Judge',
          associatedJudgeFormatted: 'Chief Judge',
          caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
          caseStatus: 'New',
          formattedFiledDate: '01/20/18',
          formattedName: 'Affidavit of Bob in Support of Petition',
          receivedAt: '2018-01-20',
        },
        {
          associatedJudge: 'Judge A',
          associatedJudgeFormatted: 'A',
          caseId: '421872dc-e87d-4214-8ad0-c861d9b76c88',
          caseStatus: 'New',
          formattedFiledDate: '01/20/18',
          formattedName: 'Affidavit of Bob in Support of Petition',
          receivedAt: '2018-01-20',
        },
        {
          associatedJudge: 'Chief Judge',
          associatedJudgeFormatted: 'Chief Judge',
          caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
          caseStatus: 'New',
          formattedFiledDate: '01/10/19',
          formattedName: 'Administrative Record',
          receivedAt: '2019-01-10',
        },
      ],
      judges: ['Chief Judge'],
    });
  });

  it('formats judges and filters pending items by selected judge', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [{ name: 'Judge A' }, { name: 'Judge B' }],
        pendingItems: mockPendingItems,
        screenMetadata: { pendingItemsFilters: { judge: 'Chief Judge' } },
      },
    });
    expect(result).toMatchObject({
      items: [
        {
          associatedJudge: 'Chief Judge',
          associatedJudgeFormatted: 'Chief Judge',
          caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
          caseStatus: 'New',
          formattedFiledDate: '01/20/18',
          formattedName: 'Affidavit of Bob in Support of Petition',
          receivedAt: '2018-01-20',
        },
        {
          associatedJudge: 'Chief Judge',
          associatedJudgeFormatted: 'Chief Judge',
          caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
          caseStatus: 'New',
          formattedFiledDate: '01/10/19',
          formattedName: 'Administrative Record',
          receivedAt: '2019-01-10',
        },
      ],
      judges: ['A', 'B', 'Chief Judge'],
    });
  });
});
