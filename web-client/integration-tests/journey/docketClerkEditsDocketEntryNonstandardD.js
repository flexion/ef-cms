import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import {
  getFormattedDocketEntriesForTest,
  getPetitionDocumentForCase,
} from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardD = integrationTest => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard D scenario', async () => {
    let { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    const { docketEntryId } = formattedDocketEntriesOnDocketRecord[0];
    const petitionDocument = getPetitionDocumentForCase(
      integrationTest.getState('caseDetail'),
    );
    expect(docketEntryId).toBeDefined();
    expect(petitionDocument.docketEntryId).toBeDefined();

    const docketEntriesBefore = formattedDocketEntriesOnDocketRecord.length;

    await integrationTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('currentPage')).toEqual('PaperFiling');
    expect(integrationTest.getState('docketEntryId')).toEqual(docketEntryId);

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'CS',
    });

    await integrationTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({
      previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
      serviceDate: VALIDATION_ERROR_MESSAGES.serviceDate[1],
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'serviceDateDay',
      value: '5',
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'serviceDateMonth',
      value: '5',
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'serviceDateYear',
      value: '2015',
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'previousDocument',
      value: petitionDocument.docketEntryId,
    });

    await integrationTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});

    ({ formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest));

    const docketEntriesAfter = formattedDocketEntriesOnDocketRecord.length;

    expect(docketEntriesBefore).toEqual(docketEntriesAfter);

    const updatedDocketEntry = formattedDocketEntriesOnDocketRecord[0];
    expect(updatedDocketEntry).toMatchObject({
      descriptionDisplay:
        'Certificate of Service of Petition 05-05-2015 some additional info',
    });

    const updatedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'Certificate of Service of Petition 05-05-2015',
      documentType: 'Certificate of Service',
      eventCode: 'MISCL',
      serviceDate: '2015-05-05T04:00:00.000Z',
    });
  });
};
