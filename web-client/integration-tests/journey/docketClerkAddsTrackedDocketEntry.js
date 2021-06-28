import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { contactPrimaryFromState } from '../helpers';

export const docketClerkAddsTrackedDocketEntry = (
  integrationTest,
  fakeFile,
  paperServiceRequested = false,
) => {
  const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

  return it('Docketclerk adds tracked paper filing', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('submitPaperFilingSequence');

    expect(integrationTest.getState('validationErrors')).toMatchObject({
      dateReceived: VALIDATION_ERROR_MESSAGES.dateReceived[1],
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      eventCode: VALIDATION_ERROR_MESSAGES.eventCode,
      filers: VALIDATION_ERROR_MESSAGES.filers,
      primaryDocumentFile:
        'Scan or upload a document to serve, or click Save for Later to serve at a later time',
    });

    // primary document
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

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'APPL',
    });

    expect(integrationTest.getState('form.documentType')).toEqual(
      'Application',
    );

    await integrationTest.runSequence('submitPaperFilingSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'Application for Flavortown',
    });

    await integrationTest.runSequence('submitPaperFilingSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    if (!paperServiceRequested) {
      expect(integrationTest.getState('alertSuccess').message).toEqual(
        'Your entry has been added to docket record.',
      );

      expect(integrationTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );
    } else {
      expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();
      expect(integrationTest.getState('currentPage')).toEqual(
        'PrintPaperService',
      );
    }
    expect(integrationTest.getState('form')).toEqual({});

    expect(integrationTest.getState('caseDetail.hasPendingItems')).toEqual(
      true,
    );
    expect(integrationTest.getState('caseDetail.automaticBlocked')).toEqual(
      true,
    );
  });
};
