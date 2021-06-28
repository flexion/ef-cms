import { AUTOMATIC_BLOCKED_REASONS } from '../../../shared/src/business/entities/EntityConstants';
import { getFormattedDocketEntriesForTest } from '../helpers';

export const docketClerkEditsDocketEntryMeta = (
  integrationTest,
  docketRecordIndex,
  data = {},
) => {
  return it('docket clerk edits docket entry meta', async () => {
    expect(integrationTest.getState('currentPage')).toEqual(
      'EditDocketEntryMeta',
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'eventCode',
        value: 'REQA',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'servedPartiesCode',
        value: 'B',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'ordinalValue',
        value: 'First',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDate',
        value: '2020-01-04T05:00:00.000Z',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateDay',
        value: '04',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateMonth',
        value: '01',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filingDateYear',
        value: '2020',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'partyIrsPractitioner',
        value: 'true',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'action',
        value: 'Added new nickname of "Sauceboss"',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'hasOtherFilingParty',
        value: true,
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'pending',
        value: true,
      },
    );

    await integrationTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({
      otherFilingParty: 'Enter other filing party name.',
    });

    // note: this is not possible if the docket entry is already served
    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'otherFilingParty',
        value: 'Brianna Noble',
      },
    );

    await integrationTest.runSequence(
      'updateDocketEntryMetaDocumentFormValueSequence',
      {
        key: 'filedBy',
        value: data.filedBy || 'Resp. & Petr. Mona Schultz, Brianna Noble',
      },
    );

    await integrationTest.runSequence('submitEditDocketEntryMetaSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('alertSuccess')).toMatchObject({
      message: 'Docket entry changes saved.',
    });

    expect(integrationTest.getState('caseDetail.automaticBlocked')).toEqual(
      true,
    );
    expect(
      integrationTest.getState('caseDetail.automaticBlockedReason'),
    ).toEqual(AUTOMATIC_BLOCKED_REASONS.pending);
    expect(integrationTest.getState('caseDetail.hasPendingItems')).toEqual(
      true,
    );
    const docketEntries = integrationTest.getState('caseDetail.docketEntries');
    const pendingDocketEntry = docketEntries.find(
      d => d.index === docketRecordIndex,
    );

    expect(pendingDocketEntry.pending).toEqual(true);

    const { formattedPendingDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(integrationTest);

    integrationTest.updatedDocketEntryId = pendingDocketEntry.docketEntryId;

    expect(formattedPendingDocketEntriesOnDocketRecord).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketEntryId: pendingDocketEntry.docketEntryId,
        }),
      ]),
    );
  });
};
