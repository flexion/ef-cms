import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

export const petitionsClerkCreatesOrderFromMessage = integrationTest => {
  return it('petitions clerk creates an order from a message', async () => {
    await integrationTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: integrationTest.docketNumber,
      parentMessageId: integrationTest.parentMessageId,
    });

    await integrationTest.runSequence(
      'openCreateOrderChooseTypeModalSequence',
      {
        parentMessageId: integrationTest.parentMessageId,
      },
    );

    await integrationTest.runSequence(
      'updateCreateOrderModalFormValueSequence',
      {
        key: 'eventCode',
        value: 'O',
      },
    );

    await integrationTest.runSequence('submitCreateOrderModalSequence');

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is a test order.</p>',
    });

    await integrationTest.runSequence('submitCourtIssuedOrderSequence');

    expect(integrationTest.getState('validationErrors')).toEqual({});
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();

    await integrationTest.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await integrationTest.runSequence('saveDocumentSigningSequence');

    expect(integrationTest.getState('currentPage')).toEqual('MessageDetail');

    const messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: integrationTest.getState(),
    });
    expect(messageDetailFormatted.attachments.length).toEqual(2);
    expect(messageDetailFormatted.attachments[1]).toMatchObject({
      documentTitle: 'Order',
    });

    const { formattedDraftDocuments } = await getFormattedDocketEntriesForTest(
      integrationTest,
    );

    const draftOrder = formattedDraftDocuments.find(
      document => document.documentTitle === 'Order',
    );

    expect(draftOrder).toBeTruthy();
    expect(draftOrder.signedAt).toBeDefined();
  });
};
