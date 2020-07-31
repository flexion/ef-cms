import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedPendingItems as formattedPendingItemsComputed } from './formattedPendingItems';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedPendingItems', () => {
  const {
    CHIEF_JUDGE,
    DOCKET_NUMBER_SUFFIXES,
    DOCUMENT_PROCESSING_STATUS_OPTIONS,
    DOCUMENT_RELATIONSHIPS,
    STATUS_TYPES,
  } = applicationContext.getConstants();

  const formattedPendingItems = withAppContextDecorator(
    formattedPendingItemsComputed,
  );

  const mockPendingItems = [
    {
      associatedJudge: CHIEF_JUDGE,
      caseCaption: 'Brett Osborne, Petitioner',
      caseStatus: STATUS_TYPES.new,
      category: 'Miscellaneous',
      certificateOfServiceDate: null,
      createdAt: '2019-01-10',
      docketNumber: '101-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
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
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      scenario: 'Standard',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      workItems: [
        {
          assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          assigneeName: 'Test Docketclerk',
          caseStatus: STATUS_TYPES.new,
          completedAt: '2019-11-13T00:38:59.049Z',
          completedBy: 'Test Docketclerk',
          completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          completedMessage: 'completed',
          createdAt: '2019-11-13T00:38:59.048Z',
          docketNumber: '101-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
          document: {
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
            relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
            scenario: 'Standard',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
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
      associatedJudge: CHIEF_JUDGE,
      caseCaption: 'Brett Osborne, Petitioner',
      caseStatus: STATUS_TYPES.new,
      category: 'Supporting Document',
      certificateOfServiceDate: null,
      createdAt: '2018-01-20',
      docketNumber: '101-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
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
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      scenario: 'Nonstandard C',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      workItems: [
        {
          assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          assigneeName: 'Test Docketclerk',
          caseStatus: STATUS_TYPES.new,
          completedAt: '2019-11-13T02:27:07.801Z',
          completedBy: 'Test Docketclerk',
          completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          completedMessage: 'completed',
          createdAt: '2019-11-13T02:26:51.448Z',
          docketNumber: '101-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
          document: {
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
            relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
            scenario: 'Nonstandard C',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
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
      caseStatus: STATUS_TYPES.new,
      category: 'Supporting Document',
      certificateOfServiceDate: null,
      createdAt: '2018-01-20',
      docketNumber: '103-19',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
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
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      scenario: 'Nonstandard C',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      workItems: [
        {
          assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          assigneeName: 'Test Docketclerk',
          caseStatus: STATUS_TYPES.new,
          completedAt: '2019-11-13T02:27:07.801Z',
          completedBy: 'Test Docketclerk',
          completedByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          completedMessage: 'completed',
          createdAt: '2019-11-13T02:26:51.448Z',
          docketNumber: '101-19',
          docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.WHISTLEBLOWER,
          document: {
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
            relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
            scenario: 'Nonstandard C',
            userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          },
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

  it('returns the cases and judges', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        pendingItems: mockPendingItems,
      },
    });
    expect(result).toMatchObject({
      items: [
        {
          associatedJudge: CHIEF_JUDGE,
          associatedJudgeFormatted: CHIEF_JUDGE,
          caseStatus: STATUS_TYPES.new,
          formattedFiledDate: '01/20/18',
          formattedName: 'Affidavit of Bob in Support of Petition',
          receivedAt: '2018-01-20',
        },
        {
          associatedJudge: 'Judge A',
          associatedJudgeFormatted: 'A',
          caseStatus: STATUS_TYPES.new,
          formattedFiledDate: '01/20/18',
          formattedName: 'Affidavit of Bob in Support of Petition',
          receivedAt: '2018-01-20',
        },
        {
          associatedJudge: CHIEF_JUDGE,
          associatedJudgeFormatted: CHIEF_JUDGE,
          caseStatus: STATUS_TYPES.new,
          formattedFiledDate: '01/10/19',
          formattedName: 'Administrative Record',
          receivedAt: '2019-01-10',
        },
      ],
      judges: [CHIEF_JUDGE],
    });
  });

  it('formats judges and filters pending items by selected judge', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [{ name: 'Judge A' }, { name: 'Judge B' }],
        pendingItems: mockPendingItems,
        screenMetadata: { pendingItemsFilters: { judge: CHIEF_JUDGE } },
      },
    });
    expect(result).toMatchObject({
      items: [
        {
          associatedJudge: CHIEF_JUDGE,
          associatedJudgeFormatted: CHIEF_JUDGE,
          caseStatus: STATUS_TYPES.new,
          formattedFiledDate: '01/20/18',
          formattedName: 'Affidavit of Bob in Support of Petition',
          receivedAt: '2018-01-20',
        },
        {
          associatedJudge: CHIEF_JUDGE,
          associatedJudgeFormatted: CHIEF_JUDGE,
          caseStatus: STATUS_TYPES.new,
          formattedFiledDate: '01/10/19',
          formattedName: 'Administrative Record',
          receivedAt: '2019-01-10',
        },
      ],
      judges: ['A', 'B', CHIEF_JUDGE],
    });
  });
});
