import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkAddsPaperFiledDocketEntryAndSavesForLater = (
  integrationTest,
  fakeFile,
) => {
  const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;
  const { DOCUMENT_RELATIONSHIPS, OBJECTIONS_OPTIONS_MAP } =
    applicationContext.getConstants();

  return it('Docketclerk adds paper filed docket entry and saves for later', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: false,
    });

    await integrationTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(integrationTest.getState('validationErrors')).toMatchObject({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[1],
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      filers: VALIDATION_ERROR_MESSAGES.filers,
    });

    //primary document
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    const contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    const docketEntryEventCode = 'M115';
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: docketEntryEventCode,
    });

    expect(integrationTest.getState('form.documentType')).toEqual(
      'Motion for Leave to File',
    );

    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: false,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.NO,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'APPW',
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocumentFile',
      value: fakeFile,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocumentFileSize',
      value: 100,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.additionalInfo',
      value: 'Test Secondary Additional Info',
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.addToCoversheet',
      value: true,
    });

    await integrationTest.runSequence('updateScreenMetadataSequence', {
      key: DOCUMENT_RELATIONSHIPS.SUPPORTING,
      value: true,
    });

    await integrationTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    integrationTest.docketEntryId = integrationTest
      .getState('caseDetail.docketEntries')
      .find(doc => doc.eventCode === docketEntryEventCode).docketEntryId;

    expect(integrationTest.getState('alertSuccess').message).toEqual(
      'Your entry has been added to docket record.',
    );

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
    expect(integrationTest.getState('form')).toEqual({});
  });
};
