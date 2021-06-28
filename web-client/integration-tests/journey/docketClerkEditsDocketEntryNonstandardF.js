import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import {
  getFormattedDocketEntriesForTest,
  getPetitionDocumentForCase,
} from '../helpers';

const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;

export const docketClerkEditsDocketEntryNonstandardF = integrationTest => {
  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard F scenario', async () => {
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
      value: 'SUPM',
    });

    await integrationTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({
      ordinalValue: VALIDATION_ERROR_MESSAGES.ordinalValue,
      previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'ordinalValue',
      value: 'First',
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
      descriptionDisplay: 'First Supplement to Petition some additional info',
    });

    const updatedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'First Supplement to Petition',
      documentType: 'Supplement',
      eventCode: 'MISCL',
    });
  });
};
