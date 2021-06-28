export const docketClerkEditsPaperFiledDocketEntryFromQC = integrationTest => {
  return it('Docket clerk edits paper-filed docket entry from QC', async () => {
    await integrationTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: integrationTest.docketEntryId,
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'secondaryDocument.eventCode',
      value: 'A',
    });

    await integrationTest.runSequence('openConfirmPaperServiceModalSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    expect(integrationTest.getState('form.documentTitle')).toEqual(
      'Motion for Leave to File Answer',
    );
  });
};
