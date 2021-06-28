import { formattedMessageDetail as formattedMessageDetailComputed } from '../../src/presenter/computeds/formattedMessageDetail';
import { getFormattedDocketEntriesForTest } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
);

export const docketClerkRemovesSignatureFromMessage = integrationTest => {
  return it('docket clerk removes signature on an order from a message', async () => {
    await integrationTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: integrationTest.docketNumber,
      parentMessageId: integrationTest.parentMessageId,
    });

    let messageDetailFormatted = runCompute(formattedMessageDetail, {
      state: integrationTest.getState(),
    });
    const orderDocument = messageDetailFormatted.attachments[1];
    expect(orderDocument.documentTitle).toEqual('Order');

    await integrationTest.runSequence(
      'openConfirmRemoveSignatureModalSequence',
      {
        docketEntryIdToEdit: orderDocument.documentId,
      },
    );

    await integrationTest.runSequence('removeSignatureSequence');

    expect(integrationTest.getState('currentPage')).toEqual('MessageDetail');

    const { formattedDraftDocuments } = await getFormattedDocketEntriesForTest(
      integrationTest,
    );

    const caseOrderDocument = formattedDraftDocuments.find(
      d => d.docketEntryId === orderDocument.documentId,
    );
    expect(caseOrderDocument.signedAt).toEqual(null);
  });
};
