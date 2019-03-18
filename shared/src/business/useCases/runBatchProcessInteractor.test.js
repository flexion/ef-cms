const { runBatchProcess } = require('./runBatchProcessInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const User = require('../entities/User');
const { Case } = require('../entities/Case');
const sinon = require('sinon');

const MOCK_WORK_ITEMS = [
  {
    assigneeId: null,
    assigneeName: 'IRSBatchSystem',
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    caseStatus: 'Batched for IRS',
    createdAt: '2018-12-27T18:06:02.971Z',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      createdAt: '2018-12-27T18:06:02.968Z',
      documentId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
      documentType: Case.documentTypes.petitionFile,
    },
    isInitializeCase: true,
    messages: [
      {
        createdAt: '2018-12-27T18:06:02.968Z',
        from: 'Petitioner',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'Petition ready for review',
        messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
        role: 'petitioner',
        to: null,
      },
    ],
    section: 'irsBatchSection',
    sentBy: 'petitioner',
    updatedAt: '2018-12-27T18:06:02.968Z',
    workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
  },
];
describe('zip petition documents and send to dummy S3 IRS respository', () => {
  const deleteWorkItemFromSectionStub = sinon.stub().resolves(null);
  const zipDocumentsStub = sinon.stub().resolves(null);
  const deleteDocumentStub = sinon.stub().resolves(null);

  let applicationContext;
  let mockCase;

  beforeEach(() => {
    mockCase = MOCK_CASE;
    mockCase.documents[0].workItems = MOCK_WORK_ITEMS;
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'bob',
          role: 'petitionsclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          deleteDocument: deleteDocumentStub,
          deleteWorkItemFromSection: deleteWorkItemFromSectionStub,
          getCaseByCaseId: () => Promise.resolve(mockCase),
          getWorkItemsBySection: () => Promise.resolve(MOCK_WORK_ITEMS),
          zipDocuments: zipDocumentsStub,
        };
      },
    };
  });

  it('throws unauthorized error if user is unauthorized', async () => {
    applicationContext.getCurrentUser = () => {
      return { userId: 'notauser' };
    };
    let error;
    try {
      await runBatchProcess({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'Unauthorized for send to IRS Holding Queue',
    );
  });

  it('runs batch process for case in IRS queue', async () => {
    await runBatchProcess({
      applicationContext,
    });
    expect(deleteWorkItemFromSectionStub.getCall(0).args[0]).toMatchObject({
      section: 'irsBatchSection',
      workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
    });
    expect(zipDocumentsStub.getCall(0).args[0]).toMatchObject({
      fileNames: [
        'Petition.pdf',
        'Statement of Taxpayer Identification.pdf',
        'Answer.pdf',
        'Stipulated Decision.pdf',
      ],
      s3Ids: [
        'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
        'e6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
      ],
      zipName: '101-18_Test_Taxpayer.zip',
    });
    expect(deleteDocumentStub.getCall(0).args[0]).toMatchObject({
      key: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
  });
});
