const sinon = require('sinon');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  getDocumentQCBatchedForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCBatchedForSectionInteractor');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForSectionInteractor');
const {
  getDocumentQCInboxForUserInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForUserInteractor');
const {
  recallPetitionFromIRSHoldingQueueInteractor,
} = require('../useCases/recallPetitionFromIRSHoldingQueueInteractor');
const {
  sendPetitionToIRSHoldingQueueInteractor,
} = require('../useCases/sendPetitionToIRSHoldingQueueInteractor');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { createCaseInteractor } = require('../useCases/createCaseInteractor');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { User } = require('../entities/User');

const DATE = '2019-03-01T22:54:06.000Z';

describe('recallPetitionFromIRSHoldingQueueInteractor integration test', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(DATE);
    applicationContext = createTestApplicationContext();
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('should create the expected work items and update their status when a petition is recalled', async () => {
    const { caseId } = await createCaseInteractor({
      applicationContext,
      petitionFileId: '92eac064-9ca5-4c56-80a0-c5852c752277',
      petitionMetadata: {
        caseType: 'Innocent Spouse',
        contactPrimary: {
          address1: '19 First Freeway',
          address2: 'Ad cumque quidem lau',
          address3: 'Anim est dolor animi',
          city: 'Rerum eaque cupidata',
          countryType: 'domestic',
          email: 'petitioner@example.com',
          name: 'Rick Petitioner',
          phone: '+1 (599) 681-5435',
          postalCode: '89614',
          state: 'AP',
        },
        contactSecondary: {},
        filingType: 'Myself',
        hasIrsNotice: false,
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        preferredTrialCity: 'Aberdeen, South Dakota',
        procedureType: 'Small',
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    applicationContext.getCurrentUser = () => {
      return new User({
        name: 'Test Petitionsclerk',
        role: User.ROLES.petitionsClerk,
        userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      });
    };

    let theCase = await getCaseInteractor({
      applicationContext,
      caseId,
    });
    expect(theCase.status).toEqual('New');

    await sendPetitionToIRSHoldingQueueInteractor({
      applicationContext,
      caseId,
    });

    theCase = await getCaseInteractor({
      applicationContext,
      caseId,
    });
    expect(theCase.status).toEqual(Case.STATUS_TYPES.batchedForIRS);

    let petitionSectionOutbox = await getDocumentQCBatchedForSectionInteractor({
      applicationContext,
      section: 'petitions',
    });
    expect(petitionSectionOutbox).toMatchObject([
      {
        assigneeId: '63784910-c1af-4476-8988-a02f92da8e09',
        assigneeName: 'IRS Holding Queue',
        caseStatus: Case.STATUS_TYPES.batchedForIRS,
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          documentType: 'Petition',
          filedBy: 'Petr. Rick Petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Alex Petitionsclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Rick Petitioner is ready for review.',
          },
          {
            from: 'Test Petitionsclerk',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition batched for IRS',
            to: 'IRS Holding Queue',
            toUserId: '63784910-c1af-4476-8988-a02f92da8e09',
          },
        ],
        section: 'irsBatchSection',
        sentBy: 'Test Petitionsclerk',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    await recallPetitionFromIRSHoldingQueueInteractor({
      applicationContext,
      caseId,
    });

    petitionSectionOutbox = await getDocumentQCBatchedForSectionInteractor({
      applicationContext,
      section: 'petitions',
    });
    expect(petitionSectionOutbox).toMatchObject([]);

    theCase = await getCaseInteractor({
      applicationContext,
      caseId,
    });
    expect(theCase.status).toEqual('Recalled');

    const petitionSectionInbox = await getDocumentQCInboxForSectionInteractor({
      applicationContext,
      section: 'petitions',
    });
    expect(petitionSectionInbox).toMatchObject([
      {
        assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Petitionsclerk',
        caseStatus: Case.STATUS_TYPES.recalled,
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          documentType: 'Petition',
          filedBy: 'Petr. Rick Petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Alex Petitionsclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Rick Petitioner is ready for review.',
          },
          {
            from: 'Test Petitionsclerk',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition batched for IRS',
            to: 'IRS Holding Queue',
            toUserId: '63784910-c1af-4476-8988-a02f92da8e09',
          },
          {
            from: 'IRS Holding Queue',
            fromUserId: '63784910-c1af-4476-8988-a02f92da8e09',
            message: 'Petition recalled from IRS Holding Queue',
            to: 'Test Petitionsclerk',
            toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'petitions',
        sentBy: 'Test Petitionsclerk',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);

    const userSectionInbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
    expect(userSectionInbox).toMatchObject([
      {
        assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
        assigneeName: 'Test Petitionsclerk',
        caseStatus: Case.STATUS_TYPES.recalled,
        docketNumber: '101-19',
        docketNumberSuffix: 'S',
        document: {
          documentType: 'Petition',
          filedBy: 'Petr. Rick Petitioner',
          userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Alex Petitionsclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Rick Petitioner is ready for review.',
          },
          {
            from: 'Test Petitionsclerk',
            fromUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition batched for IRS',
            to: 'IRS Holding Queue',
            toUserId: '63784910-c1af-4476-8988-a02f92da8e09',
          },
          {
            from: 'IRS Holding Queue',
            fromUserId: '63784910-c1af-4476-8988-a02f92da8e09',
            message: 'Petition recalled from IRS Holding Queue',
            to: 'Test Petitionsclerk',
            toUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
        section: 'petitions',
        sentBy: 'Test Petitionsclerk',
        sentBySection: 'petitions',
        sentByUserId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
