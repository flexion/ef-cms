import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  assignWorkItems,
  findWorkItemByDocketNumber,
  getCaseMessagesForCase,
  getFormattedDocumentQCMyInbox,
  getFormattedDocumentQCMyOutbox,
  getFormattedDocumentQCSectionInbox,
  getIndividualInboxCount,
  getNotifications,
  getSectionInboxCount,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadExternalDecisionDocument,
  uploadExternalRatificationDocument,
  uploadPetition,
  wait,
} from './helpers';

const integrationTest = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Create a work item', () => {
  beforeEach(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  let caseDetail;
  let qcMyInboxCountBefore;
  let qcSectionInboxCountBefore;
  let notificationsBefore;
  let decisionWorkItem;

  loginAs(integrationTest, 'docketclerk@example.com');

  it('login as the docketclerk and cache the initial inbox counts', async () => {
    await getFormattedDocumentQCMyInbox(integrationTest);
    qcMyInboxCountBefore = getIndividualInboxCount(integrationTest);

    await getFormattedDocumentQCSectionInbox(integrationTest);
    qcSectionInboxCountBefore = getSectionInboxCount(integrationTest);

    notificationsBefore = getNotifications(integrationTest);
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('login as a tax payer and create a case', async () => {
    caseDetail = await uploadPetition(integrationTest, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Secondary Person',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    integrationTest.docketNumber = caseDetail.docketNumber;
    expect(caseDetail.docketNumber).toBeDefined();
  });

  it('petitioner uploads the external documents', async () => {
    await integrationTest.runSequence('gotoFileDocumentSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    await uploadExternalDecisionDocument(integrationTest);
    await uploadExternalDecisionDocument(integrationTest);
    await uploadExternalRatificationDocument(integrationTest);
    await uploadExternalRatificationDocument(integrationTest);
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  it('login as the docketclerk and verify there are 4 document qc section inbox entries', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      integrationTest,
    );

    decisionWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );
    expect(decisionWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    const qcSectionInboxCountAfter = getSectionInboxCount(integrationTest);
    expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 4);
  });

  it('have the docketclerk assign those 4 items to self', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      integrationTest,
    );
    const decisionWorkItems = documentQCSectionInbox.filter(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );
    await assignWorkItems(integrationTest, 'docketclerk', decisionWorkItems);
  });

  it('verify the docketclerk has 4 messages in document qc my inbox', async () => {
    await refreshElasticsearchIndex();
    const documentQCMyInbox = await getFormattedDocumentQCMyInbox(
      integrationTest,
    );
    decisionWorkItem = findWorkItemByDocketNumber(
      documentQCMyInbox,
      caseDetail.docketNumber,
    );
    expect(decisionWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
    const qcMyInboxCountAfter = getIndividualInboxCount(integrationTest);
    expect(qcMyInboxCountAfter).toEqual(qcMyInboxCountBefore + 4);
  });

  it('verify the docketclerk has the expected unread count', async () => {
    await refreshElasticsearchIndex();
    const notifications = getNotifications(integrationTest);
    expect(notifications).toMatchObject({
      qcUnreadCount: notificationsBefore.qcUnreadCount + 4,
    });
  });

  it('docket clerk QCs a document, updates the document title, and generates a Notice of Docket Change', async () => {
    await integrationTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: decisionWorkItem.docketEntry.docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });

    await wait(1000);

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    await integrationTest.runSequence('completeDocketEntryQCSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();

    const documentQCMyInbox = await getFormattedDocumentQCMyInbox(
      integrationTest,
    );

    const foundInMyInbox = documentQCMyInbox.find(workItem => {
      return workItem.workItemId === decisionWorkItem.workItemId;
    });

    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      integrationTest,
    );

    const foundInSectionInbox = documentQCSectionInbox.find(workItem => {
      return workItem.workItemId === decisionWorkItem.workItemId;
    });

    const noticeDocketEntry = integrationTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.documentType === 'Notice of Docket Change');

    expect(foundInMyInbox).toBeFalsy();
    expect(foundInSectionInbox).toBeFalsy();

    expect(noticeDocketEntry).toBeTruthy();
    expect(noticeDocketEntry.servedAt).toBeDefined();
    expect(noticeDocketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
    expect(integrationTest.getState('modal.showModal')).toEqual(
      'PaperServiceConfirmModal',
    );

    await integrationTest.runSequence('navigateToPrintPaperServiceSequence');
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();
  });

  it('docket clerk completes QC of a document and sends a message', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      integrationTest,
    );

    decisionWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );

    expect(decisionWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    await integrationTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: decisionWorkItem.docketEntry.docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('DocketEntryQc');

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    integrationTest.setState('modal.showModal', '');

    await integrationTest.runSequence(
      'openCompleteAndSendMessageModalSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'CreateMessageModalDialog',
    );

    expect(integrationTest.getState('modal.form.subject')).toEqual('Answer');

    await integrationTest.runSequence(
      'completeDocketEntryQCAndSendMessageSequence',
    );

    let errors = integrationTest.getState('validationErrors');

    expect(errors).toEqual({
      message: 'Enter a message',
      toSection: 'Select a section',
      toUserId: 'Select a recipient',
    });

    const updatedDocumentTitle = 'Motion in Limine';
    const messageBody = 'This is a message in a bottle';

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value: updatedDocumentTitle,
    });

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: messageBody,
    });

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'toSection',
      value: 'petitions',
    });

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '7805d1ab-18d0-43ec-bafb-654e83405416',
    });

    await integrationTest.runSequence(
      'completeDocketEntryQCAndSendMessageSequence',
    );

    await refreshElasticsearchIndex();

    errors = integrationTest.getState('validationErrors');

    expect(errors).toEqual({});

    expect(integrationTest.getState('alertSuccess')).toMatchObject({
      message: 'Motion in Limine QC completed and message sent.',
    });

    expect(integrationTest.getState('currentPage')).toBe('WorkQueue');

    const myOutbox = (
      await getFormattedDocumentQCMyOutbox(integrationTest)
    ).filter(item => item.docketNumber === caseDetail.docketNumber);
    const qcDocumentTitleMyOutbox = myOutbox[0].docketEntry.documentTitle;

    expect(qcDocumentTitleMyOutbox).toBe(updatedDocumentTitle);

    const formattedCaseMessages = await getCaseMessagesForCase(integrationTest);
    const qcDocumentMessage =
      formattedCaseMessages.inProgressMessages[0].message;

    expect(qcDocumentMessage).toBe(messageBody);

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'PaperServiceConfirmModal',
    );

    await integrationTest.runSequence('navigateToPrintPaperServiceSequence');
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();
  });

  it('docket clerk completes QC of a document, updates freeText, and sends a message', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      integrationTest,
    );

    const ratificationWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );

    expect(ratificationWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Ratification of do the test',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    await integrationTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: ratificationWorkItem.docketEntry.docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('DocketEntryQc');

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'break the test',
    });

    integrationTest.setState('modal.showModal', '');

    await integrationTest.runSequence(
      'openCompleteAndSendMessageModalSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('modal.showModal')).toEqual(
      'CreateMessageModalDialog',
    );

    const updatedDocumentTitle = 'Ratification of break the test';

    expect(integrationTest.getState('modal.form.subject')).toEqual(
      updatedDocumentTitle,
    );

    const messageBody = 'This is a message in a bottle';

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: messageBody,
    });

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'toSection',
      value: 'petitions',
    });

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '7805d1ab-18d0-43ec-bafb-654e83405416',
    });

    await integrationTest.runSequence(
      'completeDocketEntryQCAndSendMessageSequence',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('alertSuccess')).toMatchObject({
      message: `${updatedDocumentTitle} QC completed and message sent.`,
    });

    expect(integrationTest.getState('currentPage')).toBe('WorkQueue');

    const myOutbox = (
      await getFormattedDocumentQCMyOutbox(integrationTest)
    ).filter(item => item.docketNumber === caseDetail.docketNumber);
    const qcDocumentTitleMyOutbox = myOutbox[0].docketEntry.documentTitle;

    expect(qcDocumentTitleMyOutbox).toBe(updatedDocumentTitle);

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const docketEntries = integrationTest.getState('caseDetail.docketEntries');

    const ratificationDocketEntry = docketEntries.find(
      d => d.docketEntryId === ratificationWorkItem.docketEntry.docketEntryId,
    );

    const noticeDocketEntry = docketEntries.find(
      doc =>
        doc.documentTitle ===
        `Notice of Docket Change for Docket Entry No. ${ratificationDocketEntry.index}`,
    );

    expect(noticeDocketEntry).toBeTruthy();
    expect(noticeDocketEntry.servedAt).toBeDefined();
    expect(noticeDocketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
  });

  it('docket clerk updates freeText and completes QC', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      integrationTest,
    );

    const ratificationWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );

    expect(ratificationWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Ratification of do the test',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    await integrationTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: ratificationWorkItem.docketEntry.docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('DocketEntryQc');

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: '',
    });

    await integrationTest.runSequence('completeDocketEntryQCSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      freeText: 'Provide an answer',
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'striking realism, neutrality, dynamics and clarity',
    });

    await integrationTest.runSequence('completeDocketEntryQCSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    const updatedDocumentTitle =
      'Ratification of striking realism, neutrality, dynamics and clarity';

    expect(integrationTest.getState('alertSuccess')).toMatchObject({
      message: `${updatedDocumentTitle} has been completed.`,
    });

    expect(integrationTest.getState('currentPage')).toBe('WorkQueue');

    const myOutbox = (
      await getFormattedDocumentQCMyOutbox(integrationTest)
    ).filter(item => item.docketNumber === caseDetail.docketNumber);
    const qcDocumentTitleMyOutbox = myOutbox[0].docketEntry.documentTitle;

    expect(qcDocumentTitleMyOutbox).toBe(updatedDocumentTitle);

    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    const docketEntries = integrationTest.getState('caseDetail.docketEntries');

    const ratificationDocketEntry = docketEntries.find(
      d => d.docketEntryId === ratificationWorkItem.docketEntry.docketEntryId,
    );

    const noticeDocketEntry = docketEntries.find(
      doc =>
        doc.documentTitle ===
        `Notice of Docket Change for Docket Entry No. ${ratificationDocketEntry.index}`,
    );

    expect(noticeDocketEntry).toBeTruthy();
    expect(noticeDocketEntry.servedAt).toBeDefined();
    expect(noticeDocketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
  });
});
