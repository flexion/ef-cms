import { MOTION_DISPOSITIONS } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  contactPrimaryFromState,
  loginAs,
  setupTest,
  uploadPetition,
  waitForCondition,
} from './helpers';
import { fakeBlob1 } from '../../shared/src/business/test/getFakeFile';
import { userSendsMessage } from './journey/userSendsMessage';

describe('Stamp disposition judge journey test', () => {
  const cerebralTest = setupTest();

  const judgesChambers = applicationContext
    .getPersistenceGateway()
    .getJudgesChambers();
  const judgeCohenUserId = 'dabbad04-18d0-43ec-bafb-654e83405416';
  const messageSubject = 'Motion to Stamp';
  const deniedMotionDocketEntryTitle =
    'Motion DENIED as moot without prejudice';
  const grantedMotionDocketEntryTitle = 'Motion GRANTED';
  const signedJudgeName = 'Mary Ann Cohen';

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('create case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('create a paper-filed Motion docket entry', async () => {
    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    const paperFilingValidationErrors = [
      'dateReceived',
      'eventCode',
      'documentType',
      'filers',
    ];

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentUploadMode: 'preview',
      file: fakeBlob1,
      locationOnForm: 'primaryDocumentFile',
    });

    expect(Object.keys(cerebralTest.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'M000',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'For testing Stamp Disposition',
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'scenario',
      value: 'Nonstandard B',
    });

    await cerebralTest.runSequence('updateCaseAssociationFormValueSequence', {
      key: 'objections',
      value: 'No',
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence');

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const motionDocketEntry = docketEntries.find(
      entry => entry.eventCode === 'M000',
    );

    expect(motionDocketEntry).toBeDefined();

    cerebralTest.docketEntryId = motionDocketEntry.docketEntryId;
  });

  userSendsMessage(
    cerebralTest,
    messageSubject,
    judgesChambers.COHENS_CHAMBERS_SECTION.section,
    judgeCohenUserId,
  );

  loginAs(cerebralTest, 'judgecohen@example.com');
  it('apply a stamp disposition on the motion from case detail', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('goToApplyStampSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toBe('ApplyStamp');

    await cerebralTest.runSequence('submitStampMotionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      disposition: 'Enter a disposition',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'disposition',
      value: MOTION_DISPOSITIONS.DENIED,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'deniedAsMoot',
      value: true,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'deniedWithoutPrejudice',
      value: true,
    });

    await cerebralTest.runSequence('submitStampMotionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });

  it('verify the first auto-generated draft stamp order', () => {
    expect(cerebralTest.getState('currentPage')).toBe('CaseDetailInternal');

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const draftStampOrder = docketEntries.find(entry => {
      return (
        entry.isDraft === true &&
        entry.eventCode === 'O' &&
        entry.documentTitle === deniedMotionDocketEntryTitle
      );
    });

    expect(draftStampOrder).toMatchObject({
      documentTitle: deniedMotionDocketEntryTitle,
      freeText: deniedMotionDocketEntryTitle,
      isDraft: true,
      signedJudgeName,
      stampData: {
        deniedAsMoot: true,
        deniedWithoutPrejudice: true,
        disposition: 'Denied',
        entityName: 'Stamp',
      },
    });
  });

  it('apply a stamp disposition on the motion from message', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const messages = cerebralTest.getState('messages');
    const foundMessage = messages.find(
      message => message.subject === messageSubject,
    );

    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: foundMessage.parentMessageId,
    });

    await cerebralTest.runSequence('goToApplyStampSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toBe('ApplyStamp');

    await cerebralTest.runSequence('submitStampMotionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      disposition: 'Enter a disposition',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'disposition',
      value: MOTION_DISPOSITIONS.GRANTED,
    });

    await cerebralTest.runSequence('submitStampMotionSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });

  it('verify the second auto-generated draft stamp order', () => {
    expect(cerebralTest.getState('currentPage')).toBe('MessageDetail');

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const draftStampOrder = docketEntries.find(
      entry =>
        entry.isDraft === true &&
        entry.eventCode === 'O' &&
        entry.documentTitle === grantedMotionDocketEntryTitle,
    );

    expect(draftStampOrder).toMatchObject({
      documentTitle: grantedMotionDocketEntryTitle,
      freeText: grantedMotionDocketEntryTitle,
      isDraft: true,
      signedJudgeName,
      stampData: {
        disposition: 'Granted',
        entityName: 'Stamp',
      },
    });
  });
});
