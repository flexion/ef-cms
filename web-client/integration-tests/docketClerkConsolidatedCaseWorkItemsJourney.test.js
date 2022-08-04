import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkQCsDocketEntry } from './journey/docketClerkQCsDocketEntry';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import {
  docketClerkViewsSectionInbox,
  docketClerkViewsSectionInboxNotHighPriority,
} from './journey/docketClerkViewsSectionInboxNotHighPriority';
import { fakeFile } from '../integration-tests-public/helpers';
import {
  getFormattedDocumentQCMyInbox,
  getFormattedDocumentQCSectionInbox,
  getIndividualInboxCount,
  getNotifications,
  getSectionInboxCount,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadExternalAdministrativeRecord,
  uploadExternalDecisionDocument,
  uploadPetition,
} from './helpers';
import { petitionsClerkVerifiesConsolidatedCaseIndicatorSentMessagesBox } from './journey/petitionsClerkVerifiesConsolidatedCaseIndicatorSentMessagesBox';
import { petitionsClerkVerifiesLeadCaseIndicatorSentMessagesBox } from './journey/petitionsClerkVerifiesLeadCaseIndicatorSentMessagesBox';
import { petitionsClerkViewsMyDocumentQC } from './journey/petitionsClerkViewsMyDocumentQC';
import { petitionsClerkViewsSectionDocumentQC } from './journey/petitionsClerkViewsSectionDocumentQC';
import { practitionerCreatesNewCase } from './journey/practitionerCreatesNewCase';
import { practitionerFilesDocumentForOwnedCase } from './journey/practitionerFilesDocumentForOwnedCase';

const createNewWorkItemOnCase = (cerebralTest, { docketNumber }) => {
  return it('should create a new work item on a case', async () => {
    await cerebralTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: docketNumber || cerebralTest.docketNumber,
    });
    await uploadExternalDecisionDocument(cerebralTest);
  });
};

// const petitionsClerkVerifiesLeadCaseIndicatorSentMessagesBox = (
//   cerebralTest,
//   { docketNumber },
// ) => {
//   return it('petitions clerk verifies lead case indicator sent messages box', async () => {
//     await refreshElasticsearchIndex();
//     await cerebralTest.runSequence('gotoMessagesSequence', {
//       box: 'outbox',
//       queue: 'section',
//     });
//   });
// };

describe('Docket clerk consolidated case work items journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  const leadCaseDocketNumber = '111-19';
  const consolidatedCaseDocketNumber = '112-19';

  loginAs(cerebralTest, 'petitioner@example.com');

  // FLOW 1.
  // 1. create work item (adding external documents) on a case

  createNewWorkItemOnCase(cerebralTest, {
    docketNumber: leadCaseDocketNumber,
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkVerifiesLeadCaseIndicatorSentMessagesBox(cerebralTest, {
    docketNumber: leadCaseDocketNumber,
  });

  //TODO:
  // 1. VERIFY ON INBOX
  // petitionsClerkVerifiesLeadCaseIndicatorInboxMessagesBox(cerebralTest, {
  //   docketNumber: leadCaseDocketNumber,
  // });

  // 2. VERIFY ON PROGRESS

  // createNewWorkItemOnCase(cerebralTest, {
  //   docketNumber: consolidatedCaseDocketNumber,
  // });

  // petitionsClerkVerifiesConsolidatedCaseIndicatorSentMessagesBox(cerebralTest, {
  //   docketNumber: consolidatedCaseDocketNumber,
  // });

  //TODO:
  // 1. VERIFY ON INBOX
  // 2. VERIFY ON PROGRESS

  //   it('petitioner uploads the external documents', async () => {
  //     await cerebralTest.runSequence('gotoFileDocumentSequence', {
  //       docketNumber: caseDetail.docketNumber,
  // });

  //   //   await uploadExternalDecisionDocument(cerebralTest);
  //   // });
  // 2. petitions clerk verifies
  // e.g petitionsClerkVerifiesLeadCaseIndicatorSentMessagesBox(cerebralTest, {
  //   docketNumber: leadCaseDocketNumber,
  // });

  // FLOW 2. create work item (adding internal documents) on a case

  // createNewMessageOnCase(cerebralTest, {
  //   docketNumber: leadCaseDocketNumber,
  //   preserveCreatedMessage: false,
  // });
  // petitionsClerkVerifiesLeadCaseIndicatorSentMessagesBox(cerebralTest, {
  //   docketNumber: leadCaseDocketNumber,
  // });

  // createNewMessageOnCase(cerebralTest, {
  //   docketNumber: consolidatedCaseDocketNumber,
  //   preserveCreatedMessage: false,
  // });
  // petitionsClerkVerifiesConsolidatedCaseIndicatorSentMessagesBox(cerebralTest, {
  //   docketNumber: consolidatedCaseDocketNumber,
  // });
});

// describe('Docket clerk consolidated case work item journey', () => {
//   const cerebralTest = setupTest();
//   beforeAll(() => {
//     jest.setTimeout(30000);
//   });

//   afterAll(() => {
//     cerebralTest.closeSocket();
//   });

//   const overrides = {
//     preferredTrialCity: trialLocation,
//     trialLocation,
//   };
//   const trialLocation = `Boise, Idaho, ${Date.now()}`;
//   let caseDetail;
//   let qcMyInboxCountBefore;
//   let qcSectionInboxCountBefore;
//   let notificationsBefore;
//   let decisionWorkItem;

//   // TODO: setup to test consolidated group cases for document QC
//   // loginAs(cerebralTest, 'docketclerk@example.com');

//   // it('login as the docketclerk and cache the initial inbox counts', async () => {
//   //   await getFormattedDocumentQCMyInbox(cerebralTest);
//   //   qcMyInboxCountBefore = getIndividualInboxCount(cerebralTest);

//   //   await getFormattedDocumentQCSectionInbox(cerebralTest);
//   //   qcSectionInboxCountBefore = getSectionInboxCount(cerebralTest);

//   //   notificationsBefore = getNotifications(cerebralTest);
//   // });

//   // create a lead case
//   loginAs(cerebralTest, 'petitioner@example.com');

//   it('login as a petitioner to create a lead case and add external document to generate respective work item', async () => {
//     await refreshElasticsearchIndex();

//     caseDetail = await uploadPetition(cerebralTest, overrides);
//     expect(caseDetail.docketNumber).toBeDefined();
//     cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
//       caseDetail.docketNumber;
//   });

//   // upload to file to lead case
//   // it('petitioner uploads the external documents', async () => {
//   //   await cerebralTest.runSequence('gotoFileDocumentSequence', {
//   //     docketNumber: caseDetail.docketNumber,
//   //   });

//   //   await uploadExternalDecisionDocument(cerebralTest);
//   // });

//   loginAs(cerebralTest, 'docketclerk@example.com');
//   docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

//   // it('login as the docketclerk and verify there are 4 document qc section inbox entries', async () => {
//   //   await refreshElasticsearchIndex();

//   //   const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
//   //     cerebralTest,
//   //   );

//   //   decisionWorkItem = documentQCSectionInbox.find(
//   //     workItem => workItem.docketNumber === caseDetail.docketNumber,
//   //   );
//   //   expect(decisionWorkItem).toMatchObject({
//   //     docketEntry: {
//   //       documentTitle: 'Agreed Computation for Entry of Decision',
//   //       userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
//   //     },
//   //   });

//   //   const qcSectionInboxCountAfter = getSectionInboxCount(cerebralTest);
//   //   expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 4);
//   // });

//   // create a non-lead case

//   loginAs(cerebralTest, 'petitioner@example.com');
//   it('login as a petitioner and create a case to consolidate with', async () => {
//     await refreshElasticsearchIndex();

//     caseDetail = await uploadPetition(cerebralTest, overrides);
//     expect(caseDetail.docketNumber).toBeDefined();
//     cerebralTest.docketNumber = caseDetail.docketNumber;
//   });

//   // upload file to non-lead case
//   // it('should file a document on non-lead case', async () => {
//   //   // file a document on lead case
//   //   await cerebralTest.runSequence('gotoFileDocumentSequence', {
//   //     docketNumber: caseDetail.docketNumber,
//   //   });
//   // });

//   loginAs(cerebralTest, 'docketclerk@example.com');
//   docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

//   // consolidate cases
//   docketClerkOpensCaseConsolidateModal(cerebralTest);
//   docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
//   docketClerkConsolidatesCases(cerebralTest, 2);

//   // login as docket clerk
//   loginAs(cerebralTest, 'docketclerk@example.com');

//   docketClerkViewsSectionInbox(cerebralTest);

//   // 103 - 22;
//   // 104 - 22;

//   // filter for the consolidated cases (lead, non-lead)

//   // TODO: Consolidated lead case
//   // 1. Navigate to Document QC Section
//   //    Navigate to Section Document QC Inbox
//   // 2 *VerifyLeadCaseIndicatorSectionDocumentQCInbox
//   // 3. Assign work item to docket clerk
//   //    Navigate to personal
//   // 4. *VerifyLeadCaseIndicatorUserDocumentQCInbox in personal inbox
//   // Complete Document QC
//   // Verify alertSuccess says "<Document Type> Record has been completed."
//   // *VerifyLeadCaseIndicatorUserDocumentQCOutbox
//   // *VerifyLeadCaseIndicatorSectionDocumentQCOutbox

//   // TODO: Consolidated non-lead case
//   // Navigate to Document QC Section
//   // Navigate to Section Document QC Inbox
//   // *VerifyNonLeadCaseIndicatorSectionDocumentQCInbox
//   // Assign work item to docket clerk
//   // *VerifyNonLeadCaseIndicatorUserDocumentQCInbox
//   // Complete Document QC
//   // Verify alertSuccess says "<Document Type> Record has been completed."
//   // *VerifyNonLeadCaseIndicatorUserDocumentQCOutbox
//   // *VerifyNonLeadCaseIndicatorSectionDocumentQCOutbox

//   // TODO: Document QC Internal filed document

//   // TODO: Consolidated lead case
//   // Search for consolidated case lead docket number
//   // Create a paper filing on lead docket number
//   // Save filing for later
//   // Verify alertSuccess says "Your entry has been added to the docket record."
//   // Navigate to Document QC Section
//   // Navigate to Section Document QC In Progress
//   // *VerifyLeadCaseIndicatorSectionDocumentQCInProgress
//   // *VerifyLeadCaseIndicatorUserDocumentQCInProgress
//   // Save and Serve Document
//   // Verify alertSuccess says "Your entry has been added to the docket record."
//   // !BUG: no indicators are present
//   // *VerifyLeadCaseIndicatorUserDocumentQCOutbox
//   // *VerifyLeadCaseIndicatorSectionDocumentQCOutbox

//   // TODO: Consolidated non-lead case
//   // Search for consolidated case non-lead docket number
//   // Create a paper filing on non-lead docket number
//   // Save filing for later
//   // Verify alertSuccess says "Your entry has been added to the docket record."
//   // Navigate to Document QC Section
//   // Navigate to Section Document QC In Progress
//   // *VerifyNonLeadCaseIndicatorSectionDocumentQCInProgress
//   // *VerifyNonLeadCaseIndicatorUserDocumentQCInProgress
//   // Save and Serve Document
//   // Verify alertSuccess says "Your entry has been added to the docket record."
//   // !BUG: no indicators are present
//   // *VerifyNonLeadCaseIndicatorUserDocumentQCOutbox
//   // *VerifyNonLeadCaseIndicatorSectionDocumentQCOutbox
// });
