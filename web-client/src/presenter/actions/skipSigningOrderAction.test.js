import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { skipSigningOrderAction } from './skipSigningOrderAction';

describe('skipSigningOrderAction', () => {
  it('should redirect to the draft documents', async () => {
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      props: { openModal: 'SomeModal' },
      state: {
        caseDetail: {
          caseId: 'abc-123',
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order',
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result.output.path).toEqual('/case-detail/abc-123/draft-documents');
  });

  it('should set a success message', async () => {
    const result = await runAction(skipSigningOrderAction, {
      modules: {
        presenter,
      },
      props: { openModal: 'SomeModal' },
      state: {
        caseDetail: {
          caseId: 'abc-123',
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order',
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result.output.alertSuccess.message).toEqual('Order updated.');
  });
});
