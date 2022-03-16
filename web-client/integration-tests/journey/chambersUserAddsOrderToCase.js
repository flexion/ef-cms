import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';

export const chambersUserAddsOrderToCase = cerebralTest => {
  const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

  return it('Chambers user adds order to case', async () => {
    await cerebralTest.runSequence('openCreateOrderChooseTypeModalSequence');

    await cerebralTest.runSequence('submitCreateOrderModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentTitle: errorMessages.documentTitle[0].message,
      documentType: errorMessages.documentType,
      eventCode: errorMessages.eventCode,
    });

    const createdOrderEventCode = 'ODD';
    await cerebralTest.runSequence('updateCreateOrderModalFormValueSequence', {
      key: 'eventCode',
      value: createdOrderEventCode,
    });

    expect(cerebralTest.getState('modal.documentType')).toEqual(
      'Order of Dismissal and Decision',
    );

    await cerebralTest.runSequence('submitCreateOrderModalSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await cerebralTest.runSequence('submitCourtIssuedOrderSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();

    //skip signing and go back to caseDetail
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: cerebralTest.getState('caseDetail'),
      });

    cerebralTest.docketEntryId = draftDocuments.find(
      document => document.eventCode === createdOrderEventCode,
    ).docketEntryId;
  });
};
