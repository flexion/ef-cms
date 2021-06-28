import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const docketClerkEditsOrderFromMessage = integrationTest => {
  const formattedMessageDetail = withAppContextDecorator(
    formattedMessageDetailComputed,
  );

  return it('docket clerk edits a signed order from a message', async () => {
    await integrationTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: integrationTest.docketNumber,
      parentMessageId: integrationTest.parentMessageId,
    });

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: integrationTest.getState(),
    });
    const orderDocument = messageDetailFormatted.attachments[1];
    expect(orderDocument.documentTitle).toEqual('Order');

    await integrationTest.runSequence('openConfirmEditModalSequence', {
      docketEntryIdToEdit: orderDocument.documentId,
      docketNumber: integrationTest.docketNumber,
      parentMessageId: integrationTest.parentMessageId,
      redirectUrl: `/messages/${integrationTest.docketNumber}/message-detail/${integrationTest.parentMessageId}`,
    });

    await integrationTest.runSequence('navigateToEditOrderSequence');

    expect(integrationTest.getState('currentPage')).toEqual('CreateOrder');
    expect(integrationTest.getState('form.documentTitle')).toEqual('Order');

    await integrationTest.runSequence('openEditOrderTitleModalSequence');

    expect(integrationTest.getState('modal.eventCode')).toEqual('O');
    expect(integrationTest.getState('modal.documentTitle')).toEqual('Order');

    await integrationTest.runSequence('updateFormValueSequence', {
      key: 'richText',
      value: '<p>This is an updated order.</p>',
    });

    await integrationTest.runSequence('submitCourtIssuedOrderSequence');

    expect(integrationTest.getState('currentPage')).toEqual('SignOrder');
    expect(integrationTest.getState('pdfPreviewUrl')).toBeDefined();

    await integrationTest.runSequence('skipSigningOrderSequence');

    expect(integrationTest.getState('currentPage')).toEqual('MessageDetail');

    messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: integrationTest.getState(),
    });
    expect(messageDetailFormatted.attachments.length).toEqual(2);

    const { formattedDraftDocuments } = await getFormattedDocketEntriesForTest(
      integrationTest,
    );

    const caseOrderDocument = formattedDraftDocuments.find(
      d => d.docketEntryId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toEqual(null);
    expect(caseOrderDocument.documentTitle).toBeDefined();
  });
};
