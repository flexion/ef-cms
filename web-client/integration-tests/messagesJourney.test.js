import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { docketClerkAddsDocketEntryFromMessage } from './journey/docketClerkAddsDocketEntryFromMessage';
import { docketClerkAppliesSignatureFromMessage } from './journey/docketClerkAppliesSignatureFromMessage';
import { docketClerkCompletesMessageThread } from './journey/docketClerkCompletesMessageThread';
import { docketClerkEditsOrderFromMessage } from './journey/docketClerkEditsOrderFromMessage';
import { docketClerkRemovesSignatureFromMessage } from './journey/docketClerkRemovesSignatureFromMessage';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkViewsCompletedMessagesOnCaseDetail } from './journey/docketClerkViewsCompletedMessagesOnCaseDetail';
import { docketClerkViewsForwardedMessageInInbox } from './journey/docketClerkViewsForwardedMessageInInbox';
import {
  getTextByCount,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionsClerk1CreatesNoticeFromMessageDetail } from './journey/petitionsClerk1CreatesNoticeFromMessageDetail';
import { petitionsClerk1RepliesToMessage } from './journey/petitionsClerk1RepliesToMessage';
import { petitionsClerk1VerifiesCaseStatusOnMessage } from './journey/petitionsClerk1VerifiesCaseStatusOnMessage';
import { petitionsClerk1ViewsMessageDetail } from './journey/petitionsClerk1ViewsMessageDetail';
import { petitionsClerk1ViewsMessageInbox } from './journey/petitionsClerk1ViewsMessageInbox';
import { petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments } from './journey/petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments';
import { petitionsClerkCreatesNewMessageOnCaseWithNoAttachments } from './journey/petitionsClerkCreatesNewMessageOnCaseWithNoAttachments';
import { petitionsClerkCreatesOrderFromMessage } from './journey/petitionsClerkCreatesOrderFromMessage';
import { petitionsClerkForwardsMessageToDocketClerk } from './journey/petitionsClerkForwardsMessageToDocketClerk';
import { petitionsClerkForwardsMessageWithAttachment } from './journey/petitionsClerkForwardsMessageWithAttachment';
import { petitionsClerkVerifiesCompletedMessageNotInInbox } from './journey/petitionsClerkVerifiesCompletedMessageNotInInbox';
import { petitionsClerkVerifiesCompletedMessageNotInSection } from './journey/petitionsClerkVerifiesCompletedMessageNotInSection';
import { petitionsClerkViewsInProgressMessagesOnCaseDetail } from './journey/petitionsClerkViewsInProgressMessagesOnCaseDetail';
import { petitionsClerkViewsRepliesAndCompletesMessageInInbox } from './journey/petitionsClerkViewsRepliesAndCompletesMessageInInbox';
import { petitionsClerkViewsReplyInInbox } from './journey/petitionsClerkViewsReplyInInbox';
import { petitionsClerkViewsSentMessagesBox } from './journey/petitionsClerkViewsSentMessagesBox';

const integrationTest = setupTest();
const { PETITIONS_SECTION, STATUS_TYPES } = applicationContext.getConstants();

describe('messages journey', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('Create test case to send messages', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
    integrationTest.documentId = caseDetail.docketEntries[0].docketEntryId;
  });

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments(integrationTest);
  createNewMessageOnCase(integrationTest);
  petitionsClerkViewsSentMessagesBox(integrationTest);
  petitionsClerk1VerifiesCaseStatusOnMessage(integrationTest, STATUS_TYPES.new);

  loginAs(integrationTest, 'docketclerk1@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(integrationTest);

  loginAs(integrationTest, 'petitionsclerk1@example.com');
  petitionsClerk1ViewsMessageInbox(integrationTest);
  petitionsClerk1VerifiesCaseStatusOnMessage(
    integrationTest,
    STATUS_TYPES.generalDocketReadyForTrial,
  );
  petitionsClerk1ViewsMessageDetail(integrationTest);
  petitionsClerk1RepliesToMessage(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  petitionsClerkViewsReplyInInbox(integrationTest);
  petitionsClerkCreatesOrderFromMessage(integrationTest);
  petitionsClerkForwardsMessageToDocketClerk(integrationTest);
  petitionsClerkViewsInProgressMessagesOnCaseDetail(integrationTest);

  loginAs(integrationTest, 'docketclerk@example.com');
  docketClerkViewsForwardedMessageInInbox(integrationTest);
  docketClerkEditsOrderFromMessage(integrationTest);
  docketClerkAppliesSignatureFromMessage(integrationTest);
  docketClerkRemovesSignatureFromMessage(integrationTest);
  docketClerkAppliesSignatureFromMessage(integrationTest);
  docketClerkAddsDocketEntryFromMessage(integrationTest);
  docketClerkCompletesMessageThread(integrationTest);
  docketClerkViewsCompletedMessagesOnCaseDetail(integrationTest);

  loginAs(integrationTest, 'petitionsclerk1@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments(integrationTest);
  createNewMessageOnCase(integrationTest);
  petitionsClerk1ViewsMessageInbox(integrationTest);
  petitionsClerk1ViewsMessageDetail(integrationTest);
  petitionsClerk1CreatesNoticeFromMessageDetail(integrationTest);

  loginAs(integrationTest, 'petitionsclerk1@example.com');
  petitionsClerkCreatesNewMessageOnCaseWithNoAttachments(integrationTest);

  loginAs(integrationTest, 'petitionsclerk1@example.com');
  petitionsClerkForwardsMessageWithAttachment(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  createNewMessageOnCase(integrationTest);

  loginAs(integrationTest, 'petitionsclerk1@example.com');
  petitionsClerkViewsRepliesAndCompletesMessageInInbox(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  it('wait for ES index', async () => {
    await refreshElasticsearchIndex();
  });
  petitionsClerkVerifiesCompletedMessageNotInInbox(integrationTest);
  petitionsClerkVerifiesCompletedMessageNotInSection(integrationTest);

  loginAs(integrationTest, 'petitionsclerk@example.com');
  it('attaches a document to a message with a very long title, which is truncated in the subject', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('openCreateMessageModalSequence');

    await integrationTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: PETITIONS_SECTION,
      },
    );

    await integrationTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '4805d1ab-18d0-43ec-bafb-654e83405416', //petitionsclerk1
    });

    const currentDocketEntries = integrationTest.getState(
      'caseDetail.docketEntries',
    );
    const longDocumentTitle = getTextByCount(255);

    const docketEntryWithLongTitle = {
      addToCoversheet: false,
      createdAt: '2021-04-19T19:22:08.389Z',
      docketEntryId: '999cd272-da92-4e31-bedc-28cdad2e08b0',
      docketNumber: '304-21',
      documentTitle: longDocumentTitle,
      documentType: longDocumentTitle,
      entityName: 'DocketEntry',
      eventCode: 'STIN',
      filedBy: 'Petr. Mona Schultz',
      filingDate: '2021-04-19T19:22:08.385Z',
      index: 0,
      isDraft: false,
      isFileAttached: true,
      isMinuteEntry: false,
      isOnDocketRecord: false,
      isStricken: false,
      partyPrimary: true,
      partySecondary: false,
      pending: false,
      privatePractitioners: [],
      processingStatus: 'pending',
      receivedAt: '2021-04-19T04:00:00.000Z',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    };

    integrationTest.setState('caseDetail.docketEntries', [
      ...currentDocketEntries,
      docketEntryWithLongTitle,
    ]);

    await integrationTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: docketEntryWithLongTitle.docketEntryId,
    });

    expect(integrationTest.getState('modal.form.subject').length).toEqual(250);
    expect(integrationTest.getState('modal.form.subject')).toEqual(
      longDocumentTitle.slice(0, 250),
    );

    await integrationTest.runSequence('clearModalFormSequence');
  });
});
