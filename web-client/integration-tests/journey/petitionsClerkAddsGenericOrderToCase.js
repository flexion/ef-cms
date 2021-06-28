import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const petitionsClerkAddsGenericOrderToCase = integrationTest => {
  return it('Petitions clerk adds a generic Order (eventCode O) to case', async () => {
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
        value: 'O',
      },
    );

    expect(integrationTest.getState('modal.documentType')).toEqual('Order');

    integrationTest.freeText = 'Order to keep the free text';

    await integrationTest.runSequence(
      'updateCreateOrderModalFormValueSequence',
      {
        key: 'documentTitle',
        value: integrationTest.freeText,
      },
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

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: integrationTest.getState('caseDetail'),
      });

    const createdOrder = first(draftDocuments);

    expect(createdOrder.documentTitle).toEqual(integrationTest.freeText);
    expect(createdOrder.freeText).toEqual(integrationTest.freeText);
    expect(createdOrder.draftOrderState.documentTitle).toEqual(
      integrationTest.freeText,
    );
    expect(createdOrder.freeText).toEqual(integrationTest.freeText);

    integrationTest.docketEntryId = createdOrder.docketEntryId;
  });
};
