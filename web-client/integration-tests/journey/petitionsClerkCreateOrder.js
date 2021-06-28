import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

export const petitionsClerkCreateOrder = integrationTest => {
  return it('Petitions clerk creates order', async () => {
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    await integrationTest.runSequence(
      'updateCreateOrderModalFormValueSequence',
      {
        key: 'eventCode',
        value: 'O',
      },
    );

    await integrationTest.runSequence(
      'updateCreateOrderModalFormValueSequence',
      {
        key: 'documentTitle',
        value: 'My Awesome Order',
      },
    );

    await integrationTest.runSequence('submitCreateOrderModalSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await integrationTest.runSequence('submitCourtIssuedOrderSequence');

    //skip signing and go back to caseDetail
    await integrationTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: integrationTest.docketNumber,
    });

    expect(integrationTest.getState('caseDetail.docketEntries').length).toEqual(
      4,
    );

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: integrationTest.getState('caseDetail'),
      });

    integrationTest.docketEntryId = first(draftDocuments)
      ? first(draftDocuments).docketEntryId
      : undefined;
    expect(integrationTest.getState('draftDocumentViewerDocketEntryId')).toBe(
      integrationTest.docketEntryId,
    );
  });
};
