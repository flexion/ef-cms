import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

export const docketClerkAppliesSignatureFromMessage = integrationTest => {
  return it('docket clerk applies signature to an order from a message', async () => {
    await integrationTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: integrationTest.docketNumber,
      parentMessageId: integrationTest.parentMessageId,
    });

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: integrationTest.getState(),
    });
    const orderDocument = messageDetailFormatted.attachments[1];
    expect(orderDocument.documentTitle).toEqual('Order');

    await integrationTest.runSequence('gotoSignOrderSequence', {
      docketEntryId: orderDocument.documentId,
      docketNumber: integrationTest.docketNumber,
      parentMessageId: integrationTest.parentMessageId,
      redirectUrl: `/messages/${integrationTest.docketNumber}/message-detail/${integrationTest.parentMessageId}`,
    });

    expect(integrationTest.getState('currentPage')).toEqual('SignOrder');
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

    const caseDetailFormatted = runCompute(formattedCaseDetail, {
      state: integrationTest.getState(),
    });
    const caseOrderDocument = caseDetailFormatted.formattedDocketEntries.find(
      d => d.docketEntryId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toBeDefined();
  });
};
