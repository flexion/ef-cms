import { DocketEntryFactory } from '../../../shared/src/business/entities/docketEntry/DocketEntryFactory';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import {
  getFormattedDocketEntriesForTest,
  getPetitionDocumentForCase,
} from '../helpers';

export const docketClerkEditsDocketEntryNonstandardH = integrationTest => {
  const { VALIDATION_ERROR_MESSAGES } = DocketEntryFactory;
  const { OBJECTIONS_OPTIONS_MAP } = applicationContext.getConstants();

  return it('docket clerk edits a paper-filed incomplete docket entry with Nonstandard H scenario', async () => {
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
      value: 'M115',
    });

    await integrationTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({
      objections: VALIDATION_ERROR_MESSAGES.objections,
      secondaryDocument: VALIDATION_ERROR_MESSAGES.secondaryDocument,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'objections',
      value: OBJECTIONS_OPTIONS_MAP.YES,
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'AMAT',
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.ordinalValue',
      value: 'First',
    });
    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.previousDocument',
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
        'Motion for Leave to File First Amended Petition some additional info',
    });

    const updatedDocument = formattedDocketEntriesOnDocketRecord.find(
      document => document.docketEntryId === docketEntryId,
    );
    expect(updatedDocument).toMatchObject({
      documentTitle: 'Motion for Leave to File First Amended Petition',
      documentType: 'Motion for Leave to File',
      eventCode: 'MISCL',
    });
  });
};
