const sinon = require('sinon');
const {
  createCaseFromPaper,
} = require('../useCases/createCaseFromPaperInteractor');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  getWorkItemsBySection,
} = require('../useCases/workitems/getWorkItemsBySectionInteractor');
const {
  getWorkItemsForUser,
} = require('../useCases/workitems/getWorkItemsForUserInteractor');
const { getCase } = require('../useCases/getCaseInteractor');

const CREATED_DATE = '2019-03-01T22:54:06.000Z';
const RECEIVED_DATE = '2019-02-01T22:54:06.000Z';

describe('createCaseFromPaperInteractor integration test', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(CREATED_DATE);
    applicationContext = createTestApplicationContext({
      user: {
        name: 'Alex Docketclerk',
        role: 'docketclerk',
        userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('should persist the paper case into the database', async () => {
    const { caseId } = await createCaseFromPaper({
      applicationContext,
      petitionFileId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
      petitionMetadata: {
        caseCaption: 'Bob Jones, Petitioner',
        receivedAt: RECEIVED_DATE,
      },
    });

    const createdCase = await getCase({
      applicationContext,
      caseId,
    });

    expect(createdCase).toMatchObject({
      caseCaption: 'Bob Jones, Petitioner',
      caseTitle:
        'Bob Jones, Petitioner v. Commissioner of Internal Revenue, Respondent',
      createdAt: CREATED_DATE,
      currentVersion: '1',
      docketNumber: '101-19',
      docketNumberSuffix: null,
      docketRecord: [
        {
          description: 'Petition',
          filedBy: 'Bob Jones',
          filingDate: RECEIVED_DATE,
          status: undefined,
        },
      ],
      documents: [
        {
          createdAt: RECEIVED_DATE,
          documentType: 'Petition',
          filedBy: 'Bob Jones',
          workItems: [
            {
              assigneeId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
              assigneeName: 'Alex Docketclerk',
              caseStatus: 'New',
              createdAt: CREATED_DATE,
              docketNumber: '101-19',
              docketNumberSuffix: null,
              document: {
                documentId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
                documentType: 'Petition',
                filedBy: 'Bob Jones',
                workItems: [],
              },
              isInitializeCase: true,
              messages: [
                {
                  createdAt: CREATED_DATE,
                  from: 'Alex Docketclerk',
                  fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                  message: 'Petition filed by Bob Jones is ready for review.',
                },
              ],
              section: 'docket',
              sentBy: 'Alex Docketclerk',
              sentByUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
      ],
      initialDocketNumberSuffix: '_',
      initialTitle:
        'Bob Jones, Petitioner v. Commissioner of Internal Revenue, Respondent',
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      ownershipDisclosureFileId: undefined,
      petitionFileId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
      receivedAt: RECEIVED_DATE,
      status: 'New',
      stinFileId: undefined,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      yearAmounts: [],
    });

    const docketclerkInbox = await getWorkItemsForUser({
      applicationContext,
    });

    expect(docketclerkInbox).toMatchObject([
      {
        assigneeName: 'Alex Docketclerk',
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: null,
        document: {
          createdAt: RECEIVED_DATE,
          documentType: 'Petition',
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Alex Docketclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Bob Jones is ready for review.',
          },
        ],
        section: 'docket',
        sentBy: 'Alex Docketclerk',
      },
    ]);

    const docketsSectionInbox = await getWorkItemsBySection({
      applicationContext,
      section: 'docket',
    });

    expect(docketsSectionInbox).toMatchObject([
      {
        assigneeName: 'Alex Docketclerk',
        caseStatus: 'New',
        docketNumber: '101-19',
        docketNumberSuffix: null,
        document: {
          createdAt: RECEIVED_DATE,
          documentType: 'Petition',
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Alex Docketclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Bob Jones is ready for review.',
          },
        ],
        section: 'docket',
        sentBy: 'Alex Docketclerk',
      },
    ]);
  });
});
