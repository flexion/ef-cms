import { OrderWithoutBody } from '../../../shared/src/business/entities/orders/OrderWithoutBody';
import { applicationContext } from '../../src/applicationContext';
import { first } from 'lodash';

const errorMessages = OrderWithoutBody.VALIDATION_ERROR_MESSAGES;

export const petitionsClerkAddsOrderToCase = integrationTest => {
  return it('Petitions clerk adds Order to case', async () => {
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

    const { draftDocuments } = applicationContext
      .getUtilities()
      .getFormattedCaseDetail({
        applicationContext,
        caseDetail: integrationTest.getState('caseDetail'),
      });

    integrationTest.docketEntryId = first(draftDocuments)
      ? first(draftDocuments).docketEntryId
      : undefined;
  });
};
