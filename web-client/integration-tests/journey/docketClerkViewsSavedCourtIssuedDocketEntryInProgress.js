import { formattedCaseDetail } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export default (test, documentId) => {
  return it('Docket Clerk views an in-progress docket entry for the given court-issued document', async () => {
    const caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: test.getState(),
      },
    );

    const orderDocument = caseDetailFormatted.docketRecordWithDocument.find(
      entry => (entry.document.documentId = documentId),
    );

    expect(orderDocument).toBeTruthy();

    await test.runSequnce('gotoEditCourtIssuedDocketEntrySequence', {
      docketNumber: orderDocument.docketNumber,
      documentId: orderDocument.documentId,
    });

    expect(test.getState('currentPage')).toEqual('CourtIssuedDocketEntry');
    expect(test.getState('isEditingDocketEntry')).toBeTruthy();
    expect(test.getState('form.eventCode')).toEqual(orderDocument.eventCode);
  });
};
