import {
  contactPrimaryFromState,
  fakeFile,
  loginAs,
  setupTest,
  uploadPetition,
  wait,
} from './helpers';
import { docketClerkAddsMiscellaneousPaperFiling } from './journey/docketClerkAddsMiscellaneousPaperFiling';
const integrationTest = setupTest();

describe('Docket Clerk edits a paper filing journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    integrationTest.closeSocket();
  });

  loginAs(integrationTest, 'petitioner@example.com');
  it('create case', async () => {
    const caseDetail = await uploadPetition(integrationTest);
    expect(caseDetail.docketNumber).toBeDefined();
    integrationTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(integrationTest, 'docketclerk@example.com');
  it('create a paper-filed docket entry', async () => {
    await integrationTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    const paperFilingValidationErrors = [
      'dateReceived',
      'eventCode',
      'documentType',
      'filers',
    ];

    expect(Object.keys(integrationTest.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

    await integrationTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(Object.keys(integrationTest.getState('validationErrors'))).toEqual(
      paperFilingValidationErrors,
    );

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
      key: 'eventCode',
      value: 'A',
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Little Rock, AR',
    });

    const contactPrimary = contactPrimaryFromState(integrationTest);

    await integrationTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await integrationTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    const caseDocument = integrationTest.getState('caseDetail.docketEntries.0');
    expect(caseDocument).toMatchObject({
      documentTitle: 'Answer',
      documentType: 'Answer',
      eventCode: 'A',
      isFileAttached: true,
    });
    integrationTest.docketEntryId = caseDocument.docketEntryId;
  });

  it('open modal to serve paper-filed document (but do not serve)', async () => {
    const caseDocument = integrationTest.getState('caseDetail.docketEntries.0');

    await integrationTest.runSequence(
      'changeTabAndSetViewerDocumentToDisplaySequence',
      {
        docketRecordTab: 'documentView',
        viewerDocumentToDisplay: caseDocument,
      },
    );

    await integrationTest.runSequence(
      'openConfirmServePaperFiledDocumentSequence',
      {
        docketEntryId: integrationTest.docketEntryId,
      },
    );

    expect(
      integrationTest.getState('viewerDocumentToDisplay.documentTitle'),
    ).toBeDefined();
  });

  it('edit paper-filed docket entry, replacing PDF', async () => {
    await integrationTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: integrationTest.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('PaperFiling');
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();
    expect(
      integrationTest.getState('currentViewMetadata.documentUploadMode'),
    ).toEqual('preview');

    await integrationTest.runSequence('removeScannedPdfSequence');
    await wait(200);

    expect(
      integrationTest.getState('currentViewMetadata.documentUploadMode'),
    ).toEqual('scan');

    await integrationTest.runSequence('submitPaperFilingSequence');

    expect(Object.keys(integrationTest.getState('validationErrors'))).toEqual([
      'primaryDocumentFile',
    ]);

    await integrationTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    expect(integrationTest.getState('currentPage')).toEqual('PaperFiling');
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();
    expect(integrationTest.getState('form.primaryDocumentFile')).toBeDefined();
    expect(
      integrationTest.getState('currentViewMetadata.documentUploadMode'),
    ).toEqual('preview');

    await integrationTest.runSequence('submitPaperFilingSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );
  });

  docketClerkAddsMiscellaneousPaperFiling(integrationTest, fakeFile);
});
