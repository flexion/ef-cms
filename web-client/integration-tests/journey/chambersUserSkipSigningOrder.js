import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const chambersUserSkipSigningOrder = integrationTest => {
  return it('Chambers user adds order and skips signing', async () => {
    await integrationTest.runSequence('openCreateOrderChooseTypeModalSequence');

    await integrationTest.runSequence('submitCreateOrderModalSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({
      documentTitle: errorMessages.documentTitle[0].message,
      documentType: errorMessages.documentType,
      eventCode: errorMessages.eventCode,
    });

    await integrationTest.runSequence(
      'updateCreateOrderModalFormValueSequence',
      {
        key: 'eventCode',
        value: 'ODD',
      },
    );

    expect(integrationTest.getState('modal.documentType')).toEqual(
      'Order of Dismissal and Decision',
    );

    await integrationTest.runSequence('submitCreateOrderModalSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await integrationTest.runSequence('submitCourtIssuedOrderSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();

    //skip signing and go back to caseDetail
    await integrationTest.runSequence('skipSigningOrderSequence');

    // should navigate to the case detail internal page with the draft documents tab showing
    expect(integrationTest.getState('currentPage')).toEqual(
      'CaseDetailInternal',
    );

    expect(
      integrationTest.getState(
        'currentViewMetadata.caseDetail.caseDetailInternalTabs.drafts',
      ),
    ).toBeTruthy();

    expect(integrationTest.getState('alertSuccess')).toBeDefined();
  });
};
